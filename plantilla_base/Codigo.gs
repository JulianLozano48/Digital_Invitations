const ID_HOJA_CALCULO = "10D53UC6tnjjzcio7e44JCjtLshT5ITWKEApbuZUxl3s";
const NOMBRE_HOJA = "Invitados";
const NOMBRE_HOJA_TEXTOS = "Textos";


function ENCODE_WHATSAPP(texto) {
  if (!texto) return "";
  var textoLimpio = texto.toString().normalize('NFC');
  textoLimpio = textoLimpio.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return encodeURIComponent(textoLimpio);
}

function doGet(e) {

  const codigo = e && e.parameter ? e.parameter.id : null;

  if (!codigo) {
    return HtmlService.createHtmlOutput(`
      <h2>Invitación no encontrada</h2>
      <p>No se recibió ningún código de invitación.</p>
    `).addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  }

  const datos = buscarInvitado(codigo);

  if (!datos) {
    return HtmlService.createHtmlOutput(`
      <h2>Invitación no encontrada</h2>
      <p>El código recibido fue: <strong>${codigo}</strong></p>
      <p>Verifica que el código exista en la hoja "Invitados".</p>
    `).addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  }

  const template = HtmlService.createTemplateFromFile("Index");

  template.codigo = datos.codigo;
  template.nombre = datos.nombre;
  template.maximo = datos.maximo;
  template.textos = obtenerTextos();

  return template
    .evaluate()
    .setTitle("Primera Comunión")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


function confirmarAsistencia(codigo) {

  const hoja = SpreadsheetApp
    .openById(ID_HOJA_CALCULO)
    .getSheetByName(NOMBRE_HOJA);

  if (!hoja) {
    throw new Error(`No se encontró la hoja llamada "${NOMBRE_HOJA}"`);
  }

  const datos = hoja.getDataRange().getValues();
  const encabezados = datos[0];
  const colConfirmados = encabezados.findIndex(
    (h) => String(h).trim().toLowerCase() === "confirmados"
  );

  if (colConfirmados === -1) {
    throw new Error(`No se encontró la columna "Confirmados" en la hoja "${NOMBRE_HOJA}".`);
  }

  for (let i = 1; i < datos.length; i++) {
    const codigoHoja = String(datos[i][0]).trim();

    if (codigoHoja.toLowerCase() === String(codigo).trim().toLowerCase()) {
      hoja.getRange(i + 1, colConfirmados + 1).setValue("Si");
      return { ok: true };
    }
  }

  throw new Error("No se encontró el código de invitación en la hoja.");
}


function buscarInvitado(codigo) {

  const hoja = SpreadsheetApp
    .openById(ID_HOJA_CALCULO)
    .getSheetByName(NOMBRE_HOJA);

  if (!hoja) {
    throw new Error(`No se encontró la hoja llamada "${NOMBRE_HOJA}"`);
  }

  const datos = hoja.getDataRange().getValues();

  for (let i = 1; i < datos.length; i++) {
    const codigoHoja = String(datos[i][0]).trim();

    if (codigoHoja.toLowerCase() === String(codigo).trim().toLowerCase()) {
      return {
        codigo: datos[i][0],
        nombre: datos[i][1],
        maximo: datos[i][2]
      };
    }
  }
  return null;

}


/**
 * Lee la hoja "Textos" (columnas: Texto | Descripcion) y devuelve un objeto
 * { Anfitrion: "...", Leyenda1: "...", ... } para usar en el template.
 */
function obtenerTextos() {

  const hoja = SpreadsheetApp
    .openById(ID_HOJA_CALCULO)
    .getSheetByName(NOMBRE_HOJA_TEXTOS);

  if (!hoja) {
    throw new Error(`No se encontró la hoja llamada "${NOMBRE_HOJA_TEXTOS}"`);
  }

  const datos = hoja.getDataRange().getDisplayValues();
  const textos = {};

  for (let i = 1; i < datos.length; i++) {
    const clave = String(datos[i][0]).trim();
    if (clave) {
      textos[clave] = datos[i][1];
    }
  }
  return textos;
}

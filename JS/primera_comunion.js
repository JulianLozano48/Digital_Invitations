
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if(entry.isIntersecting){
    entry.target.classList.add('is-visible');
    io.unobserve(entry.target);
    }
});
}, { threshold:0.15 });
revealEls.forEach(el => io.observe(el));

let targetDate = new Date('2026-11-15T15:00:00');
function updateCountdown(){
const now = new Date();
let diff = targetDate - now;
if(diff < 0) diff = 0;
const days = Math.floor(diff / (1000*60*60*24));
const hours = Math.floor((diff / (1000*60*60)) % 24);
const mins = Math.floor((diff / (1000*60)) % 60);
const secs = Math.floor((diff / 1000) % 60);
document.getElementById('cdDays').textContent = String(days).padStart(2,'0');
document.getElementById('cdHours').textContent = String(hours).padStart(2,'0');
document.getElementById('cdMins').textContent = String(mins).padStart(2,'0');
document.getElementById('cdSecs').textContent = String(secs).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

const childName = document.getElementById('childName');
const footerName = document.getElementById('footerName');
childName.addEventListener('input', () => {
footerName.textContent = childName.textContent;
});

const CODIGO_INVITADO = "<?= codigo ?>";

const confirmBtn = document.getElementById('confirmBtn');
const confirmModal = document.getElementById('confirmModal');
const modalClose = document.getElementById('modalClose');
const stepAsk = document.getElementById('stepAsk');
const stepThanks = document.getElementById('stepThanks');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');

function openConfirmModal(){
stepAsk.hidden = false;
stepThanks.hidden = true;
confirmModal.classList.add('is-open');
document.body.style.overflow = 'hidden';
}
function closeConfirmModal(){
confirmModal.classList.remove('is-open');
document.body.style.overflow = '';
}

confirmBtn.addEventListener('click', openConfirmModal);
btnNo.addEventListener('click', closeConfirmModal);
btnYes.addEventListener('click', () => {
btnYes.disabled = true;
btnNo.disabled = true;
google.script.run
    .withSuccessHandler(() => {
    btnYes.disabled = false;
    btnNo.disabled = false;
    stepAsk.hidden = true;
    stepThanks.hidden = false;
    })
    .withFailureHandler((err) => {
    btnYes.disabled = false;
    btnNo.disabled = false;
    console.error('No se pudo guardar la confirmación:', err);
    alert('No se pudo guardar la confirmación: ' + (err && err.message ? err.message : err));
    })
    .confirmarAsistencia(CODIGO_INVITADO);
});
modalClose.addEventListener('click', closeConfirmModal);
confirmModal.addEventListener('click', (e) => {
if(e.target === confirmModal) closeConfirmModal();
});
document.addEventListener('keydown', (e) => {
if(e.key === 'Escape') closeConfirmModal();
});

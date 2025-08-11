function openModal() {
  document.getElementById('modal').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  document.getElementById('modal').classList.add('hidden');
  document.body.style.overflow = 'auto';
}


document.addEventListener('DOMContentLoaded', () => {

  document
    .querySelectorAll('.open-modal-btn, #openModalBtn')
    .forEach(btn => btn.addEventListener('click', openModal));

  document.getElementById('closeModalBtn').addEventListener('click', closeModal);
  document.querySelector('#modal .modal-overlay').addEventListener('click', closeModal);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
});

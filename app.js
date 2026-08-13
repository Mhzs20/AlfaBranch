import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';

const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('[data-menu]');
const nav = document.querySelector('[data-nav]');
const dialog = document.querySelector('[data-dialog]');
const dialogImage = document.querySelector('[data-dialog-image]');
const dialogTitle = document.querySelector('[data-dialog-title]');
const toast = document.querySelector('[data-toast]');

const gallery = {
  'long-ash-blonde': ['بلوند دودی', '/assets/portfolio/edited/long-ash-blonde.jpg'],
  'blonde-bob-close': ['بلوند بژ', '/assets/portfolio/edited/blonde-bob-close.jpg'],
  'rooted-blonde-bob': ['روت‌شدو', '/assets/portfolio/edited/rooted-blonde-bob.jpg'],
  'platinum-sleek': ['پلاتینه ابریشمی', '/assets/portfolio/edited/platinum-sleek.jpg'],
  'silver-face-frame': ['سیلور فیس‌فریم', '/assets/portfolio/edited/silver-face-frame.jpg'],
};

const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('is-open', !open);
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}));

document.querySelectorAll('[data-gallery]').forEach((item) => {
  item.addEventListener('click', () => {
    const [title, src] = gallery[item.dataset.gallery];
    dialogImage.src = src;
    dialogImage.alt = item.querySelector('img').alt;
    dialogTitle.textContent = title;
    dialog.showModal();
  });
});

document.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

document.querySelector('[data-contact]')?.addEventListener('click', () => {
  toast.classList.add('is-visible');
  window.setTimeout(() => toast.classList.remove('is-visible'), 3500);
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

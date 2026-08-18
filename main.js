import '@fontsource/vazirmatn/300.css';
import '@fontsource/vazirmatn/400.css';
import '@fontsource/vazirmatn/500.css';
import '@fontsource/vazirmatn/600.css';
import '@fontsource/vazirmatn/700.css';
import './styles.css';

/*
 * HQ media policy
 * ----------------
 * The files under /assets/hq are the original user-provided JPEGs (byte-for-byte)
 * plus the original logo PNG. We never downscale or recompress these photographs.
 * Cropping is performed by CSS object-fit/object-position so the original pixels remain intact.
 */
const hqAssetMap = {
  '/assets/bridal-dark.webp': '/assets/hq/bridal-dark-source.jpg',
  '/assets/bridal-blonde.webp': '/assets/hq/bridal-blonde-source.jpg',
  '/assets/makeup-blonde.webp': '/assets/hq/makeup-blonde-source.jpg',
  '/assets/makeup-sleek.webp': '/assets/hq/makeup-sleek-source.jpg',
  '/assets/updo-back.webp': '/assets/hq/updo-back-source.jpg',
  '/assets/updo-side.webp': '/assets/hq/updo-side-source.jpg',
  '/assets/hair-long-brown.webp': '/assets/hq/hair-long-brown-source.jpg',
  '/assets/nail-nude.webp': '/assets/hq/nail-nude-denim.jpg',
  '/assets/nail-pink-hearts.webp': '/assets/hq/nail-pink-hearts.jpg',
  '/assets/nail-blue.webp': '/assets/hq/nail-blue.jpg',
  '/assets/nail-black.webp': '/assets/hq/nail-black-silver-front.jpg',
  '/assets/nail-french-red-b.webp': '/assets/hq/nail-french-red-b.jpg',
  '/assets/nail-lilac.webp': '/assets/hq/nail-lilac.jpg',
  '/assets/nail-french-macro-a.webp': '/assets/hq/nail-french-macro-a.jpg',
  '/assets/nail-french-macro-b.webp': '/assets/hq/nail-french-macro-b.jpg',
  '/assets/nail-french-red-a.webp': '/assets/hq/nail-french-red-a.jpg',
};

const mediaPositionClass = {
  '/assets/hq/bridal-dark-source.jpg': 'crop-bridal-dark',
  '/assets/hq/bridal-blonde-source.jpg': 'crop-bridal-blonde',
  '/assets/hq/makeup-blonde-source.jpg': 'crop-makeup-blonde',
  '/assets/hq/makeup-sleek-source.jpg': 'crop-makeup-sleek',
  '/assets/hq/updo-back-source.jpg': 'crop-updo-back',
  '/assets/hq/updo-side-source.jpg': 'crop-updo-side',
  '/assets/hq/updo-red-source.jpg': 'crop-updo-red',
};

const applyMediaPosition = (img, src) => {
  const className = mediaPositionClass[src];
  if (className) img.classList.add(className);
  img.dataset.originalQuality = 'true';
};

const upgradeImage = img => {
  const src = img.getAttribute('src');
  if (!src) return;
  const nextSrc = hqAssetMap[src] || src;
  if (nextSrc !== src) img.setAttribute('src', nextSrc);
  applyMediaPosition(img, nextSrc);
};

// Brand logo: keep the full original logo for large brand panels and a lossless PNG crop for compact marks.
document.querySelectorAll('.brand img, .footer-brand img').forEach(img => {
  img.setAttribute('src', '/assets/hq/kazhe-logo-mark.png');
  img.dataset.originalQuality = 'true';
});
document.querySelectorAll('.logo-float img, .contact-logo img').forEach(img => {
  img.setAttribute('src', '/assets/hq/kazhe-logo-original.png');
  img.dataset.originalQuality = 'true';
});

document.querySelectorAll('img').forEach(upgradeImage);

document.querySelectorAll('[data-src]').forEach(item => {
  const src = item.dataset.src;
  if (hqAssetMap[src]) item.dataset.src = hqAssetMap[src];
});

// Use the additional original updo photo in the third updo card instead of repeating a bridal portrait.
const updoFeatureCard = document.querySelector('.updo-card.small');
if (updoFeatureCard) {
  const updoImg = updoFeatureCard.querySelector('img');
  const updoSrc = '/assets/hq/updo-red-source.jpg';
  if (updoImg) {
    updoImg.src = updoSrc;
    updoImg.alt = 'شینیون جمع مدرن از نمای پشت';
    applyMediaPosition(updoImg, updoSrc);
  }
  updoFeatureCard.dataset.src = updoSrc;
  const label = updoFeatureCard.querySelector('span');
  if (label) label.textContent = 'شینیون جمع مدرن';
}

// Replace the static hair placeholder with the original salon video.
const hairVideoCard = document.querySelector('.hair-video');
if (hairVideoCard) {
  const placeholder = hairVideoCard.querySelector('img');
  const video = document.createElement('video');
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = 'metadata';
  video.poster = '/assets/hq/hair-long-brown-source.jpg';
  video.setAttribute('aria-label', 'ویدیوی نتیجه خدمات رنگ و لایت کاژه');

  const webm = document.createElement('source');
  webm.src = '/assets/hq/hair-result.webm';
  webm.type = 'video/webm';
  video.appendChild(webm);

  const mp4 = document.createElement('source');
  mp4.src = '/assets/hq/hair-result-original.mp4';
  mp4.type = 'video/mp4';
  video.appendChild(mp4);

  placeholder?.replaceWith(video);
}

const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const menu = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', window.scrollY > 18);
});

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menu?.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});

navLinks.forEach(link => link.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('open');
  document.body.classList.remove('menu-open');
}));

const sections = [...document.querySelectorAll('main section[id]')];
const observerNav = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  });
}, { rootMargin: '-30% 0px -60% 0px', threshold: 0.01 });
sections.forEach(section => observerNav.observe(section));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

document.querySelectorAll('[data-src]').forEach(item => {
  item.addEventListener('click', () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.className = '';
    const src = item.dataset.src;
    lightboxImage.src = src;
    const className = mediaPositionClass[src];
    if (className) lightboxImage.classList.add(className, 'lightbox-cropped-original');
    lightbox.showModal();
  });
});

lightboxClose?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', event => {
  if (event.target === lightbox) lightbox.close();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && lightbox?.open) lightbox.close();
});

const variants = [...document.querySelectorAll('.variant')];
const artwork = document.querySelector('#banana-art');
const stage = document.querySelector('.stage');
const frame = document.querySelector('#art-frame');
const stateLabel = document.querySelector('#state-label');
const stateIndex = document.querySelector('#state-index');

variants.forEach((button, index) => {
  button.style.setProperty('--swatch', button.dataset.color);
  button.addEventListener('click', () => {
    if (button.classList.contains('selected')) {
      frame.classList.remove('bump');
      void frame.offsetWidth;
      frame.classList.add('bump');
      return;
    }

    variants.forEach(item => {
      const selected = item === button;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-pressed', String(selected));
    });

    artwork.style.opacity = '0';
    frame.classList.remove('bump');
    window.setTimeout(() => {
      artwork.src = `assets/Images/${button.dataset.image}`;
      artwork.alt = `${button.dataset.name}, the Iron Peel mascot, lifting dumbbells`;
      stateLabel.textContent = button.dataset.name.toUpperCase();
      stateIndex.textContent = `${String(index + 1).padStart(2, '0')} / 04`;
      stage.dataset.tone = button.dataset.color === '#b5e62a' ? 'lime' : 'gold';
      artwork.style.opacity = '1';
      void frame.offsetWidth;
      frame.classList.add('bump');
    }, 180);
  });
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
nav.addEventListener('click', event => {
  if (event.target.closest('a')) {
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
  }
});

document.querySelector('#with-audio').addEventListener('click', () => {
  window.location.href = 'index.html?audio=1';
});

document.querySelector('#without-audio').addEventListener('click', () => {
  window.location.href = 'index.html';
});

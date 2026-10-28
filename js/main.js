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

const musicWidget = document.querySelector('#music-widget');
if (musicWidget) {
  const player = new Audio();
  const playButton = document.querySelector('#music-play');
  const trackLabel = document.querySelector('#music-track');
  const statusLabel = document.querySelector('#music-status');
  const volumeSlider = document.querySelector('#music-volume');
  let playlist = [];
  let currentTrack = 0;
  let playlistRequest;

  player.preload = 'none';
  player.volume = Number(volumeSlider.value);

  const updatePlaybackButton = () => {
    const playing = !player.paused;
    playButton.textContent = playing ? 'Ⅱ' : '▶';
    playButton.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    playButton.title = playing ? 'Pause' : 'Play';
  };

  const loadPlaylist = () => {
    if (!playlistRequest) {
      playlistRequest = fetch('json/songs.json')
        .then(response => {
          if (!response.ok) throw new Error('Playlist could not be loaded.');
          return response.json();
        })
        .then(data => {
          playlist = Array.isArray(data.tracks) ? data.tracks.filter(track => track.src) : [];
          return playlist;
        });
    }
    return playlistRequest;
  };

  const setTrack = index => {
    currentTrack = (index + playlist.length) % playlist.length;
    const track = playlist[currentTrack];
    player.src = track.src;
    trackLabel.textContent = track.title || `Track ${currentTrack + 1}`;
    return track;
  };

  const playCurrentTrack = async () => {
    try {
      const tracks = await loadPlaylist();
      if (!tracks.length) {
        statusLabel.textContent = 'No songs are listed in the playlist yet.';
        return;
      }
      if (!player.src) setTrack(currentTrack);
      await player.play();
      statusLabel.textContent = 'NOW PLAYING';
    } catch (error) {
      console.warn(error);
      statusLabel.textContent = 'Tap play to start, or check the playlist file.';
    }
  };

  const playTrackAt = async index => {
    try {
      const tracks = await loadPlaylist();
      if (!tracks.length) {
        statusLabel.textContent = 'No songs are listed in the playlist yet.';
        return;
      }
      setTrack(index);
      await player.play();
      statusLabel.textContent = 'NOW PLAYING';
    } catch (error) {
      console.warn(error);
      statusLabel.textContent = 'Tap play to start, or check the playlist file.';
    }
  };

  playButton.addEventListener('click', () => {
    if (player.paused) playCurrentTrack();
    else player.pause();
  });
  document.querySelector('#music-stop').addEventListener('click', () => {
    player.pause();
    player.currentTime = 0;
    statusLabel.textContent = 'STOPPED';
  });
  document.querySelector('#music-previous').addEventListener('click', async () => {
    if (player.currentTime > 3) {
      player.currentTime = 0;
      if (player.paused) await playCurrentTrack();
    } else {
      await playTrackAt(currentTrack - 1);
    }
  });
  document.querySelector('#music-next').addEventListener('click', () => playTrackAt(currentTrack + 1));
  volumeSlider.addEventListener('input', () => { player.volume = Number(volumeSlider.value); });
  player.addEventListener('play', updatePlaybackButton);
  player.addEventListener('pause', updatePlaybackButton);
  player.addEventListener('ended', () => playTrackAt(currentTrack + 1));
  player.addEventListener('error', () => { statusLabel.textContent = 'Could not load this track.'; });

  // The entrance choice carries audio intent through the one-click navigation.
  if (new URLSearchParams(window.location.search).get('audio') === '1') {
    playCurrentTrack();
  }
}

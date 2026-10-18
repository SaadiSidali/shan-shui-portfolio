const frame = document.querySelector('#landscape');
const toggle = document.querySelector('#motion-toggle');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = reducedMotion.matches;

function syncMotion() {
  const stopped = paused || document.hidden;
  if (frame.contentWindow && typeof frame.contentWindow.setLandscapePaused === 'function') {
    frame.contentWindow.setLandscapePaused(stopped);
  }
  toggle.setAttribute('aria-pressed', String(paused));
  toggle.setAttribute('aria-label', paused ? 'Play landscape animation' : 'Pause landscape animation');
  toggle.querySelector('.motion-text').textContent = paused ? 'Play landscape' : 'Pause landscape';
  toggle.querySelector('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
  document.body.classList.toggle('is-paused', paused);
}

toggle.addEventListener('click', () => { paused = !paused; syncMotion(); });
reducedMotion.addEventListener('change', event => { paused = event.matches; syncMotion(); });
document.addEventListener('visibilitychange', syncMotion);
frame.addEventListener('load', syncMotion);
document.querySelector('#year').textContent = new Date().getFullYear();
syncMotion();

const showcase = document.querySelector('.freelance-section');
const showcaseTrack = showcase.querySelector('.marquee-track');
const duplicate = showcase.querySelector('.marquee-group').cloneNode(true);
duplicate.setAttribute('aria-hidden', 'true');
duplicate.querySelectorAll('a').forEach(link => { link.tabIndex = -1; });
showcaseTrack.append(duplicate);
const showcaseToggle = document.querySelector('#showcase-toggle');
let showcasePaused = reducedMotion.matches;

function syncShowcase() {
  showcase.classList.toggle('showcase-paused', showcasePaused);
  showcase.classList.toggle('showcase-playing', !showcasePaused);
  showcaseToggle.setAttribute('aria-pressed', String(showcasePaused));
  showcaseToggle.innerHTML = showcasePaused ? 'Play showcase <span aria-hidden="true">▷</span>' : 'Pause showcase <span aria-hidden="true">Ⅱ</span>';
}

showcaseToggle.addEventListener('click', () => { showcasePaused = !showcasePaused; syncShowcase(); });
reducedMotion.addEventListener('change', event => { showcasePaused = event.matches; syncShowcase(); });
syncShowcase();

const showcaseViewport = showcase.querySelector('.marquee-viewport');
showcaseViewport.addEventListener('focusout', event => {
  if (!showcaseViewport.contains(event.relatedTarget)) showcaseViewport.scrollLeft = 0;
});

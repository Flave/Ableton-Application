import rebind from 'utility/rebind';
import _throttle from 'lodash/throttle';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import {select as d3_select} from 'd3-selection';
import {timer as d3_timer} from 'd3-timer';
import {easePolyInOut as d3_easePolyInOut} from 'd3-ease';
import scrollPosition from 'utility/scrollPosition';

export default function PlayButton() {
  let parent;
  let dispatch = d3_dispatch('play', 'rewind');
  let playEnter;
  let playUpdate;
  let rewindEnter;
  let rewindUpdate;
  let isPlaying = false;
  let isRewinding = false;
  let timer;

  function _playButton(_parent) {
    parent = _parent;
    draw();
    return _playButton;
  }

  function draw() {
    const currentScrollPos = scrollPosition();

    playUpdate = parent.selectAll('.controls__play-button')
      .data([1]);

    playEnter = playUpdate.enter()
      .append('span')
      .classed('controls__play-button', true)

    playEnter.merge(playUpdate)
      .on('click', isPlaying ? stop : play)
      .classed('is-playing', isPlaying)
      .html(isPlaying ? 'Stop' : 'Play');


    rewindUpdate = parent.selectAll('.controls__rewind-button')
      .data(currentScrollPos.top > 10 && !isRewinding ? [1] : []);

    rewindEnter = rewindUpdate.enter()
      .append('span')
      .on('click', rewind)
      .classed('controls__rewind-button', true)
      .html('Rewind');

    rewindUpdate
      .exit()
      .remove();
  }

  function onScroll() {
    draw();
  }

  function rewind() {
    const distance = scrollPosition().top;
    const tempo = 1100; // pixels per second
    const duration = distance / tempo * 1000;
    isRewinding = true;
    stop();
    const rewindTimer = d3_timer(function(elapsed) {
      var t = elapsed / duration;
      const y =  distance - (distance * d3_easePolyInOut(t, 3));
      window.scrollTo(0, y);
      if (scrollPosition().top <= 0) {
        rewindTimer.stop();
        isRewinding = false;
        draw();
      }
    });    
  }

  function play() {
    const currentScrollPos = scrollPosition().top;
    const bodyHeight = document.body.offsetHeight;
    const distance = bodyHeight - currentScrollPos;
    const tempo = 500; // pixels per second
    const duration = distance / tempo * 1000;
    isPlaying = true;
    draw();
    timer = d3_timer(function(elapsed) {
      window.scrollTo(0, currentScrollPos + distance * elapsed/duration);
      if (scrollPosition().top + window.innerHeight >= bodyHeight)
        stop();
    });
  }

  function stop() {
    isPlaying = false;
    timer && timer.stop();
    draw();
  }

  const throttledOnScroll = _throttle(onScroll, 100);
  document.addEventListener('scroll', throttledOnScroll);

  return rebind(_playButton, dispatch, 'on');
}
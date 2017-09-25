import rebind from 'utility/rebind';
import _throttle from 'lodash/throttle';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import {select as d3_select} from 'd3-selection';
import {timer as d3_timer} from 'd3-timer';
import {easePolyInOut as d3_easePolyInOut} from 'd3-ease';
import scrollPosition from 'utility/scrollPosition';

export default function Controls() {
  let parent;
  let dispatch = d3_dispatch('play', 'rewind');
  let playEnter;
  let playUpdate;
  let rewindEnter;
  let rewindUpdate;
  let isPlaying = false;
  let isRewinding = false;
  let tempoEnter;
  let tempoUpdate;
  let timer;
  let spacing;
  let bpm = 80;

  function _controls(_parent) {
    parent = _parent;
    draw();
    return _controls;
  }

  function draw() {

    const currentScrollPos = scrollPosition();

    // PLAY
    playUpdate = parent.selectAll('.controls__play-button')
      .data([1]);

    playEnter = playUpdate.enter()
      .append('span')
      .classed('controls__play-button', true)

    playEnter.merge(playUpdate)
      .on('click', isPlaying ? stop : play)
      .classed('is-playing', isPlaying)
      .html(isPlaying ? 'Stop' : 'Play');


    // REWIND 
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

    // TEMPO
    tempoUpdate = parent.selectAll('.controls__tempo')
      .data([1]);

    tempoEnter = tempoUpdate.enter()
      .append('span')
      .classed('controls__tempo', true);

    tempoEnter
      .append('span')
      .classed('controls__tempo-label', true)
      .html('Tempo');

    tempoEnter
      .append('input')
      .attr('type', 'range')
      .attr('min', 40)
      .attr('max', 220)
      .attr('value', bpm)
      .attr('step', 1)
      .on('input', handleTempoInput)
      .on('change', handleTempoChange)
      .classed('controls__tempo-input', true);

    tempoEnter
      .append('span')
      .classed('controls__tempo-value', true)

    tempoEnter.merge(tempoUpdate)
      .selectAll('.controls__tempo-value')
      .html(`${bpm}<span class="controls__tempo-unit">BPM</span>`);
  }

  function handleTempoInput() {
    bpm = this.value;
    draw();
  }

  function handleTempoChange() {
    bpm = this.value;
    if(isPlaying) play();
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
    stop();
    const bps = bpm / 60;
    const pixelsPerBeat = spacing * 4;
    const pixelsPerMs = bps * pixelsPerBeat / 1000;
    const currentScrollPos = scrollPosition().top;
    const bodyHeight = document.body.offsetHeight;
    isPlaying = true;
    draw();
    timer = d3_timer(function(elapsed) {
      window.scrollTo(0, currentScrollPos + pixelsPerMs * elapsed);
      if (scrollPosition().top + window.innerHeight >= bodyHeight)
        stop();
    });
  }

  function stop() {
    isPlaying = false;
    timer && timer.stop();
    draw();
  }

  _controls.spacing = function(_){
    if(!arguments.length) return spacing;
    spacing = _;
    return _controls;
  }

  const throttledDraw = _throttle(draw, 100);
  document.addEventListener('scroll', throttledDraw);

  return rebind(_controls, dispatch, 'on');
}
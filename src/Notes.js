import _throttle from 'lodash/throttle';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import INSTRUMENTS from './instruments';
import rebind from 'utility/rebind';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import {drag as d3_drag} from 'd3-drag';
import {select as d3_select} from 'd3-selection';
import {event as d3_event} from 'd3-selection';

export default function Grid() {
  let parent;
  let height;
  let data = [];  
  let notesEnter;
  let notesUpdate;
  let notes;
  let spacing;
  let runUp;
  let dispatch = d3_dispatch('play');
  let drag = d3_drag()
    .on('drag', handleDrag);
  let state = {showSound: true};

  function _notes(_parent) {
    parent = _parent;
    draw();
    return _notes;
  }

  function draw() {
    notesUpdate = parent.selectAll('div.note').data(data);
    notesEnter = notesUpdate.enter()
      .append('div')
      //.each(function(d) {checkNote.call(this, d, true)})
      .classed('note', true)
      .call(drag);

    notesEnter
      .append('img')
      .attr('src', (d) =>  _find(INSTRUMENTS, {id: d.instrumentId}).image)
      .classed('note__image', true);

    notes = notesEnter.merge(notesUpdate)
      .style('top', (d, i) => {
        let width = window.innerWidth;
        let x = d.gain * width;
        let scale = d.scale ? d.scale : x / width * 1 + 1;
        let y = d.y !== undefined ? d.y : getYFromScore(d);
        let distToLastBeat = ((y - runUp) % spacing) - 0;
        if(distToLastBeat < spacing/4)
          y = Math.floor((y-runUp) / spacing) * spacing + runUp;
        else if(distToLastBeat > spacing - spacing/4)
          y = Math.ceil((y-runUp) / spacing) * spacing + runUp;

        return `${y}px`
      })
      .style('left', (d) => {
        return `${d.gain * window.innerWidth}px`;
      })
      .style('transform', function(d) {
        const width = window.innerWidth;
        const x = parseInt(d3_select(this).style('left').replace('px', ''));
        const scale = d.scale ? d.scale : x / width * 1 + 1;
        const rotation = x / width * 360;
        return `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`;
      })

    notesUpdate.exit()
      .attr('transform', 'translate(-50%, -50%) scale(0)')
      .remove();
  }

  function checkNote(d, mute) {
    mute = mute || !state.showSound;
    const bbox = this.getBoundingClientRect();
    const centerY = window.innerHeight/2;
    const offsetRatio = (bbox.left + bbox.width) / window.innerWidth;
    if(bbox.top + bbox.height/2 <= centerY && !d.played) {
      d.played = true;
      !mute && bounce(this);
      !mute && dispatch.call('play', null, d.instrumentId, offsetRatio, 1);
    } else if(bbox.top + bbox.height/2 > centerY && d.played) {
      d.played = false;
      !mute && bounce(this);
      !mute && dispatch.call('play', null, d.instrumentId, offsetRatio, -1);
    }
  }

  function bounce(el) {
    el = d3_select(el);
    el.classed('is-played', true);
    window.setTimeout(() => el.classed('is-played', false), 300);
  }

  function getYFromScore(d) {
    return (d.bar * spacing * 16) + (d.beat * spacing) + (d.offset * spacing) + runUp;
  }

  function onScroll() {
    notes.each(function(d) {
      checkNote.call(this, d);
    });
  }
  const throttledOnScroll = _throttle(onScroll, 20);

  function handleDrag(d) {
    let {x, y} = d3_event;
    d.y = y < runUp ? runUp : y;
    d.gain = x / window.innerWidth;
    d.scale = x / window.innerWidth * 1 + 1;

    draw();
    const bbox = this.getBoundingClientRect();
    checkNote.call(this, d);
  }


  _notes.height = function(_){
    if(!arguments.length) return height;
    height = _;
    return _notes;
  }

  _notes.data = function(_){
    if(!arguments.length) return data;
    data = _;
    return _notes;
  }

  _notes.spacing = function(_){
    if(!arguments.length) return spacing;
    spacing = _;
    return _notes;
  }

  _notes.runUp = function(_){
    if(!arguments.length) return runUp;
    runUp = _;
    return _notes;
  }

  _notes.state = function(_){
    if(!arguments.length) return state;
    state = _;
    return _notes;
  }

  document.addEventListener('scroll', throttledOnScroll);
  return rebind(_notes, dispatch, 'on');
}
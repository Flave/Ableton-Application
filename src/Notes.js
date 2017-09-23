import _throttle from 'lodash/throttle';
import rebind from 'utility/rebind';
import {dispatch as d3_dispatch} from 'd3-dispatch';

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

  function _notes(_parent) {
    parent = _parent;
    draw();
    return _notes;
  }

  function draw() {
    notesUpdate = parent.selectAll('div.note').data(data);
    const notesEnter = notesUpdate.enter()
      .append('div')
      .classed('note', true)
      .style('top', (d, i) => `${getY(d)}px`)

    notes = notesEnter.merge(notesUpdate);
  }

  function checkNote(d) {
    const top = this.getBoundingClientRect().top
    if(top < runUp && !d.played) {
      d.played = true;
      dispatch.call('play', null, d, 1);
    } else if(top > runUp && d.played) {
      d.played = false;
      dispatch.call('play', null, d, -1);
    }
  }

  function getY(d) {
    return (d.bar * spacing * 16) + (d.beat * spacing) + (d.offset * spacing) + runUp;
  }

  function onScroll() {
    notes.each(checkNote);
  }
  const throttledOnScroll = _throttle(onScroll, 100);

  function registerEvents() {
    document.addEventListener('scroll', throttledOnScroll);
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

  registerEvents();
  return rebind(_notes, dispatch, 'on');
}
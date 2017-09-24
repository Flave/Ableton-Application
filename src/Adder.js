import _throttle from 'lodash/throttle';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';
import INSTRUMENTS from './instruments';
import rebind from 'utility/rebind';
import {dispatch as d3_dispatch} from 'd3-dispatch';
import {drag as d3_drag} from 'd3-drag';
import {select as d3_select} from 'd3-selection';
import {event as d3_event} from 'd3-selection';
import scrollPosition from 'utility/scrollPosition';

export default function Adder() {
  let parent;
  let notes;
  let dispatch = d3_dispatch('add', 'play');
  let drag = d3_drag()
    .on('start', handleDragStart)
    .on('drag', handleDrag)
    .on('end', handleDragEnd)
  let instrumentsEnter;
  let instrumentsUpdate;

  function _adder(_parent) {
    parent = _parent;
    draw();
    return _adder;
  }

  function draw() {
    instrumentsUpdate = parent.selectAll('.adder__instrument')
      .data(INSTRUMENTS);

    instrumentsEnter = instrumentsUpdate.enter()
      .append('span')
      .classed('adder__instrument', true)
      .style('background-image', (d) => `url(${d.image})`)

    instrumentsEnter.append('span')
      .classed('adder__draggable', true)
      .call(drag);

    instrumentsEnter
      .selectAll('.adder__draggable')
      .append('img')
      .classed('adder__instrument-image', true)
      .attr('src', (d) => d.image);
  }

  function handleDragStart(d) {
    const {x, y} = d3_event;
    const bbox = this.getBoundingClientRect();
    const offsetX = bbox.width - (bbox.width - x);
    const offsetY = bbox.height - (bbox.height - y);
    dispatch.call('play', null, d.id, 1);
    d.dragOffset = {x: offsetX, y: offsetY};

    d3_select(this)
      .classed('is-played', true);
  }

  function handleDrag(d) {
    const {x, y} = d3_event;
    const parentX = this.parentNode.getBoundingClientRect().left;
    const scale = (parentX + x) / window.innerWidth * 4 + 1;
    d3_select(this)
      .classed('is-played', false)
      .style('transform', `translate(${x - d.dragOffset.x}px, ${y - d.dragOffset.y}px) scale(${scale})`)
      .style('transform-origin', `${d.offsetX}px ${d.offsetY}px`);
  }

  function handleDragEnd(d) {
    const {x, y, dx, dy} = d3_event;
    if(x - d.dragOffset.x !== 0 && y - d.dragOffset.y !== 0) {
      const centerDx = d.dragOffset.x - 45/2;
      const centerDy = d.dragOffset.y - 45/2;

      dispatch.call('add', null, d.id, {
        x: d3_event.sourceEvent.clientX - centerDx,
        y: d3_event.sourceEvent.clientY - centerDy + scrollPosition().top
      });
    }

    d.dragOffset = undefined;
    d3_select(this)
      .classed('is-played', false)
      .style('transform', 'none');
  }

  return rebind(_adder, dispatch, 'on');
}
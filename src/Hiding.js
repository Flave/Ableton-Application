import rebind from 'utility/rebind';
import {dispatch as d3_dispatch} from 'd3-dispatch';

export default function Controls() {
  let parent;
  let dispatch = d3_dispatch('togglevisual', 'togglesound');
  let visualEnter;
  let visualUpdate;
  let soundEnter;
  let soundUpdate;
  let state = {
    showVisual: true, 
    showSound: true
  };

  function _hiding(_parent) {
    parent = _parent;
    draw();
    return _hiding;
  }

  function draw() {
    let {showVisual, showSound} = state;
    // VISUAL
    visualUpdate = parent.selectAll('.hiding__button--visual')
      .data(['visual']);

    visualEnter = visualUpdate.enter()
      .append('span')
      .on('click', handleVisualClick)
      .classed('hiding__button', true)
      .classed('hiding__button--visual', true)
      .html('Visual');

    visualEnter.merge(visualUpdate)
      .style('text-decoration', showVisual ? 'line-through' : 'none');

    // SOUND
    soundUpdate = parent.selectAll('.hiding__button--sound')
      .data(['sound']);

    soundEnter = soundUpdate.enter()
      .append('span')
      .on('click', handleSoundClick)
      .classed('hiding__button', true)
      .classed('hiding__button--sound', true)
      .html('Sound');

    soundEnter.merge(soundUpdate)
      .style('text-decoration', showSound ? 'line-through' : 'none');
  }

  function handleVisualClick() {
    dispatch.call('togglevisual', null, !state.showVisual);
    draw();
  }

  function handleSoundClick() {
    dispatch.call('togglesound', null, !state.showSound);
    draw();
  }

  _hiding.state = function(_){
    if(!arguments.length) return state;
    state = _;
    return _hiding;
  }

  return rebind(_hiding, dispatch, 'on');
}
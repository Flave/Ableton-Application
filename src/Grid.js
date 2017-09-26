import {NUM_LINES, NUM_BARS} from './constants';
import {range as d3_range} from 'd3-array';
import {select as d3_select} from 'd3-selection';
import {selectAll as d3_selectAll} from 'd3-selection';

export default function Grid() {
  let parent;
  let height;
  let linesData = [];
  let linesEnter;
  let linesUpdate;
  let lines;
  let spacing;
  let runUp;

  function _grid(_parent) {
    parent = _parent;
    linesData = d3_range(NUM_LINES);
    draw();

    return _grid; 
  }

  function draw() {
    linesUpdate = parent.selectAll('div.line-container').data(linesData);
    linesEnter = linesUpdate.enter()
      .append('div')
      .attr('class', (d, i) => {
        let className = 'line-container';
        className += i % 16 === 0 ? ' line-container--full' : '';
        className += i % 4 === 0 ? ' line-container--quarter' : '';
        className += i % 2 === 0 ? ' line-container--eighth' : '';
        return className;
      })

    lines = linesEnter.merge(linesUpdate)
      .style('height', `${spacing}px`)
      .style('top', d => `${getY(d)}px`);



    // Color the lines depending on what section they happen to be placed on
    d3_selectAll('.content__section')
      .each(function(d) {
        let height = this.offsetHeight;
        let top = this.offsetTop;
        let isDark = this.classList.contains('black') || this.classList.contains('purple-dark') || this.classList.contains('blue');
        lines
          .attr('class', function(d) {
            let lineTop = this.offsetTop;
            let className = d3_select(this).attr('class');
            if(lineTop > top && lineTop <= (top + height)) {
              if(isDark) {
                return `${className} line-container--bright`
              } else {
                return `${className} line-container--dark`
              }
            }
            return className;
          })
      });
  }

  function getY(i) {    
    return i * spacing + runUp;
  }

  _grid.height = function(_){
    if(!arguments.length) return height;
    height = _;
    return _grid;
  }

  _grid.spacing = function(_){
    if(!arguments.length) return spacing;
    spacing = _;
    return _grid;
  }

  _grid.runUp = function(_){
    if(!arguments.length) return runUp;
    runUp = _;
    return _grid;
  }

  return _grid;
}
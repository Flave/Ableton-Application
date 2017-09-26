export default function Hints() {
  let parent;
  let adderContainer;
  let hidingContainer;
  let adderHintUpdate;
  let hidingHintUpdate;
  let showAdderHint = true;
  let showHidingHint = true;

  function _hints(_parent) {
    parent = _parent;
    draw();
    return _hints;
  }

  function draw() {
    let adderBBox = adderContainer.getBoundingClientRect();
    let hidingBBox = hidingContainer.getBoundingClientRect();

    adderHintUpdate = parent.selectAll('.hint.hint--adder')
      .data(showAdderHint ? [1] : []);

    adderHintUpdate.enter()
      .append('div')
      .attr('class', 'hint hint--adder')
      .html('Drag the shapes onto the music sheet to add notes.')
      .style('top', `${adderBBox.bottom + 16}px`)
      .style('left', `${adderBBox.left + adderBBox.width/2}px`)

    adderHintUpdate.exit().remove();


    hidingHintUpdate = parent.selectAll('.hint.hint--hiding')
      .data(showHidingHint ? [1] : []);

    hidingHintUpdate.enter()
      .append('div')
      .attr('class', 'hint hint--hiding')
      .html('Click to show/hide the visual or the accoustic noise.')
      .style('top', `${hidingBBox.bottom + 16}px`)
      .style('left', `${hidingBBox.left + hidingBBox.width/2}px`);

    hidingHintUpdate.exit().remove();
  }

  _hints.adderContainer = function(_) {
    adderContainer = _;
    return _hints;
  }

  _hints.hidingContainer = function(_) {
    hidingContainer = _;
    return _hints;
  }

  _hints.showAdderHint = function(_) {
    showAdderHint = _;
    return _hints;
  }

  _hints.showHidingHint = function(_) {
    showHidingHint = _;
    return _hints;
  }

  return  _hints;
}
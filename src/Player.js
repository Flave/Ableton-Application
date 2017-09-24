import _find from 'lodash/find';

function player(_ctx) {
  const _player = {};
  let buffers = [];
  let ctx = _ctx;

  _player.buffers = function(_buffers) {
    buffers = _buffers;
  }

  _player.play = function(id) {
    if(!buffers.length) return;
    var source = ctx.createBufferSource();
    source.buffer = _find(buffers, {id}).buffer;
    source.connect(ctx.destination);
    source.start();
  }

  return _player;
}

export default player;
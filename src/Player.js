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
    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    var source = ctx.createBufferSource();
    // set the buffer in the AudioBufferSourceNode
    console.log(buffers, id);
    source.buffer = _find(buffers, {id}).buffer;
    // connect the AudioBufferSourceNode to the
    // destination so we can hear the sound
    source.connect(ctx.destination);
    // start the source playing
    source.start();
  }

  return _player;
}

export default player;
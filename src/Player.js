import _find from 'lodash/find';

function player(_ctx){
  const _player = {};
  let buffers = [];
  let ctx = _ctx;

  _player.buffers = function(_buffers){
    buffers = _buffers.map(({buffer, id}) => (
      {
        buffer,
        id,
        reversedBuffer: reverse(buffer, clone(buffer))
      }
    ));
  }

  // Buffer utility functions stolen from https://github.com/jaz303/audio-buffer-utils/blob/master/index.js
  function copy(from, to, offset){
    offset = offset || 0;
    for(var channel = 0, l = Math.min(from.numberOfChannels, to.numberOfChannels); channel < l; channel++)
        to.getChannelData(channel).set(from.getChannelData(channel), offset);
    return to;
  }

  function shallow(buffer){
    return ctx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
  }

  function clone (buffer){
    return copy(buffer, shallow(buffer));
  }

  function reverse(buffer, target){
    if(target) copy(buffer, target);
    else target = buffer;
    for(var i = 0, c = target.numberOfChannels; i < c; ++i)
        target.getChannelData(i).reverse();

    return target;
  }

  _player.play = function(id, direction){
    if(!buffers.length) return;
    let source = ctx.createBufferSource();
    const bufferSpec = _find(buffers, {id});
    source.buffer = direction === 1 ? bufferSpec.buffer : bufferSpec.reversedBuffer;
    source.connect(ctx.destination);
    source.start();
  }

  return _player;
}

export default player;
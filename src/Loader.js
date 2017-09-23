import AudioSampleLoader from 'utility/AudioSampleLoader';
import INSTRUMENTS from './instruments';

function loader(ctx) {
  const audioLoader = new AudioSampleLoader();
  const _loader = {};

  audioLoader.src = INSTRUMENTS.map((instrument) => instrument.sample);
  audioLoader.ctx = ctx;

  _loader.load = function(cb) {
    audioLoader.onload = function() {
      cb(null, audioLoader.response.map((buffer, i) => (
          { buffer, id: INSTRUMENTS[i].id }
        ))
      )
    }

    audioLoader.onerror = function(err) {
      cb(err);
    }

    audioLoader.send();
  }
  return _loader;
}

export default loader;
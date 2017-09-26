import kick_01 from 'assets/samples/instrument_1.mp3';
import snare_01 from 'assets/samples/instrument_2.mp3';
import hat_01 from 'assets/samples/instrument_0.mp3';
import instrument_4 from 'assets/samples/instrument_4.mp3';
import instrument_5 from 'assets/samples/instrument_5.mp3';
import instrument_6 from 'assets/samples/instrument_6.mp3';

import instrument_1_image from 'assets/images/instrument_1.svg';
import instrument_2_image from 'assets/images/instrument_2.svg';
import instrument_3_image from 'assets/images/instrument_3.svg';
import instrument_4_image from 'assets/images/instrument_4.svg';
import instrument_5_image from 'assets/images/instrument_5.svg';
import instrument_6_image from 'assets/images/instrument_6.svg';
//import instrument_2 from 'assets/images/snare.svg';

export default [
  {
    id: 'instrument_1',
    sample: kick_01,
    image: instrument_1_image,
  },
  {
    id: 'instrument_2',
    sample: snare_01,
    image: instrument_2_image
  },
  {
    id: 'instrument_3',
    sample: hat_01,
    image: instrument_3_image
  },
  {
    id: 'instrument_4',
    sample: instrument_6,
    image: instrument_4_image
  },
  {
    id: 'instrument_5',
    sample: instrument_5,
    image: instrument_5_image
  },
  {
    id: 'instrument_6',
    sample: instrument_4,
    image: instrument_6_image
  }
]
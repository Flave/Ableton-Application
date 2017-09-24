// eslint-disable-next-line no-unused-vars
import css from './style/index.scss';

import {select as d3_select} from 'd3-selection';
import {event as d3_event} from 'd3-selection';
import {queue as d3_queue} from 'd3-queue';
import _cloneDeep from 'lodash/cloneDeep';

import INITIAL_SCORES from './score';
import INSTRUMENTS from './instruments';
import {NUM_LINES, NUM_BARS} from './constants';
import Adder from './Adder';
import Grid from './Grid';
import Notes from './Notes';
import Player from './Player';
import Loader from './Loader';

const gridContainer = d3_select('#grid-container');
const musicContainer = d3_select('#music-container');
const adderContainer = d3_select('#adder-container');
const content = document.getElementById('content');
const height = content.offsetHeight;
const runUp = window.innerHeight * .5;
const scoreHeight = height - 2 * runUp;

const audioContext = new AudioContext();
const queue = d3_queue();
const musicData = _cloneDeep(INITIAL_SCORES);
const adder = Adder();
const grid = Grid();
const notes = Notes();
const loader = Loader(audioContext);
const player = Player(audioContext);

queue
  .defer(loader.load)
  .await((err, buffers) => {
    player.buffers(buffers);
  });

const handlePlay = (instrumentId, direction) => {
  player.play(instrumentId);
}

const draw = () => {
  grid
    .runUp(runUp)
    .spacing(scoreHeight / NUM_LINES)
    .height(scoreHeight)(gridContainer);

  notes
    .data(musicData)
    .runUp(runUp)
    .spacing(scoreHeight / NUM_LINES)
    .on('play', handlePlay)
    .height(scoreHeight)(musicContainer);

  adder
    .runUp(runUp)
    .on('add', function(instrumentId, {x, y}) {
      // push into array of music data so it appears in the middle
      musicData.push({instrumentId,x,y});
      notes(musicContainer);
    })
    .on('play', handlePlay)(adderContainer);
}

draw();


// CHECK WHEN SCROLLING
// RESIZE
// PADDING TOP
// eslint-disable-next-line no-unused-vars
import css from './style/index.scss';

import {select as d3_select} from 'd3-selection';
import {event as d3_event} from 'd3-selection';
import {queue as d3_queue} from 'd3-queue';
import _cloneDeep from 'lodash/cloneDeep';
import _throttle from 'lodash/throttle';

import INITIAL_SCORES from './score';
import INSTRUMENTS from './instruments';
import {NUM_LINES, NUM_BARS} from './constants';
import Adder from './Adder';
import Grid from './Grid';
import Notes from './Notes';
import Player from './Player';
import Loader from './Loader';
import Controls from './Controls';

const gridContainer = d3_select('#grid-container');
const musicContainer = d3_select('#music-container');
const adderContainer = d3_select('#adder-container');
const controlsContainer = d3_select('#controls-container');
const content = document.getElementById('content');


let runUp;
let height;
let scoreHeight;

const audioContext = new AudioContext();
const queue = d3_queue();
const musicData = _cloneDeep(INITIAL_SCORES);
const adder = Adder()
    .on('add', handleAdd)
    .on('play', handlePlay)
const grid = Grid();
const notes = Notes().on('play', handlePlay)
const controls = Controls();
const loader = Loader(audioContext);
const player = Player(audioContext);

queue
  .defer(loader.load)
  .await((err, buffers) => {
    player.buffers(buffers);
  });

function recalculateDimensions() {
  runUp = window.innerHeight * .6;
  height = content.offsetHeight;
  scoreHeight = height - runUp - window.innerHeight/2;
}

function handleResize() {
  draw();
}

function handlePlay(instrumentId, gain, reverse) {
  player.play(instrumentId, gain, reverse);
}

function handleAdd(instrumentId, {x, y}) {
  musicData.push({instrumentId,x,y});
  notes(musicContainer);
}

const draw = () => {
  recalculateDimensions();
  grid
    .runUp(runUp)
    .spacing(scoreHeight / NUM_LINES)
    .height(scoreHeight)(gridContainer);

  notes
    .data(musicData)
    .runUp(runUp)
    .spacing(scoreHeight / NUM_LINES)
    .height(scoreHeight)(musicContainer);

  controls
    .spacing(scoreHeight / NUM_LINES)(controlsContainer);

  adder.runUp(runUp)(adderContainer);
}

window.addEventListener('resize', _throttle(handleResize, 200));

draw();
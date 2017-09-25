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
import Hiding from './Hiding';
import Controls from './Controls';

// STATE
const state = {
  showVisual: true,
  showSound: true
}

// CONTAINERS
const gridContainer = d3_select('#grid-container');
const hidingContainer = d3_select('#hiding-container');
const musicContainer = d3_select('#music-container');
const adderContainer = d3_select('#adder-container');
const adderShapesContainer = d3_select('#adder-shapes-container');
const controlsContainer = d3_select('#controls-container');
const content = document.getElementById('content');

// DIMENSIONS
let runUp;
let height;
let scoreHeight;

// AUDIO
const audioContext = new AudioContext();
const musicData = _cloneDeep(INITIAL_SCORES);

// COMPONENTS
const adder = Adder()
    .on('add', handleAdd)
    .on('play', handlePlay)
const grid = Grid();
const notes = Notes().on('play', handlePlay)
const controls = Controls();
const hiding = Hiding();
const loader = Loader(audioContext);
const player = Player(audioContext);

// LOADING
const queue = d3_queue();
queue
  .defer(loader.load)
  .await((err, buffers) => {
    player.buffers(buffers);
  });


// EVENT HANDLERS
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

function handleToggleVisual(show) {
  state.showVisual = show;
  draw();
  d3_select(content).classed('is-hidden', !show);
}

function handleToggleSound(show) {
  state.showSound = show;
  draw();
  gridContainer.classed('is-hidden', !show);
  musicContainer.classed('is-hidden', !show);
  controlsContainer.classed('is-hidden', !show);
  adderContainer.classed('is-hidden', !show);
}

// UPDATE METHODS
function recalculateDimensions() {
  runUp = window.innerHeight * .6;
  height = content.offsetHeight;
  scoreHeight = height - runUp - window.innerHeight/2;
}

const draw = () => {
  recalculateDimensions();
  grid
    .runUp(runUp)
    .spacing(scoreHeight / NUM_LINES)
    .height(scoreHeight)(gridContainer);

  notes
    .state(state)
    .data(state.showSound ? musicData : [])
    .runUp(runUp)
    .spacing(scoreHeight / NUM_LINES)
    .height(scoreHeight)(musicContainer);

  controls
    .spacing(scoreHeight / NUM_LINES)(controlsContainer);

  hiding
    .state(state)
    .on('togglevisual', handleToggleVisual)
    .on('togglesound', handleToggleSound)(hidingContainer);

  adder
    .runUp(runUp)(adderShapesContainer);
}


window.addEventListener('resize', _throttle(handleResize, 200));
draw();
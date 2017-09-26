// eslint-disable-next-line no-unused-vars
import css from './style/index.scss';

import {select as d3_select} from 'd3-selection';
import {selectAll as d3_selectAll} from 'd3-selection';
import {event as d3_event} from 'd3-selection';
import {queue as d3_queue} from 'd3-queue';
import _cloneDeep from 'lodash/cloneDeep';
import _throttle from 'lodash/throttle';

import INITIAL_SCORES from './score';
import INSTRUMENTS from './instruments';
import {NUM_LINES, NUM_BARS} from './constants';

// COMPONENTS
import Adder from './Adder';
import Grid from './Grid';
import Notes from './Notes';
import Player from './Player';
import Loader from './Loader';
import Hiding from './Hiding';
import Hints from './Hints';
import Controls from './Controls';

// STATE
const state = {
  showVisual: true,
  showSound: true,
  showAdderHint: true,
  showHidingHint: true
}

// CONTAINERS
const gridContainer = d3_select('#grid-container');
const hidingContainer = d3_select('#hiding-container');
const musicContainer = d3_select('#music-container');
const adderContainer = d3_select('#adder-container');
const adderShapesContainer = d3_select('#adder__shapes-container');
const controlsContainer = d3_select('#controls-container');
const hintsContainer = d3_select('#hints-container');
const content = document.getElementById('content');
const intro = d3_select('#intro');
const outro = d3_select('#outro');

// DIMENSIONS
let runUp;
let height;
let scoreHeight;
let spacing;

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
const hints = Hints();
const loader = Loader(audioContext);
const player = Player(audioContext);

// LOADING
const queue = d3_queue();
queue
  .defer(loader.load)
  .await((err, buffers) => {
    d3_select(document.body).classed('is-loading', false);
    player.buffers(buffers);

    setTimeout(function() {
      d3_select(document.body).classed('is-reading-intro', false);
    }, 2000);
  });



// EVENT HANDLERS
function handlePlay(instrumentId, gain, reverse) {
  player.play(instrumentId, gain, reverse);
}

function handleAdd(instrumentId, {gain, y}) {
  musicData.push({instrumentId,gain,y});
  notes(musicContainer);
  state.showAdderHint = false;
  render();
}

function handleToggleVisual(show) {
  state.showVisual = show;
  state.showHidingHint = false;
  render();
  d3_select(content).classed('is-hidden', !show);
  gridContainer.classed('is-solo', !show);
}

function handleToggleSound(show) {
  state.showSound = show;
  state.showHidingHint = false;
  render();
  gridContainer.classed('is-hidden', !show);
  musicContainer.classed('is-hidden', !show);
  controlsContainer.classed('is-hidden', !show);
  adderContainer.classed('is-hidden', !show);
}

// UPDATE METHODS
function calculateDimensions() {
  runUp = document.getElementById('intro').offsetHeight;
  height = content.offsetHeight;
  scoreHeight = height - runUp - window.innerHeight * .58;
  spacing = scoreHeight / NUM_LINES;
  intro.style('height', `${runUp}px`);
  outro.style('height', `${window.innerHeight * .58}px`);
}

const render = () => {
  grid
    .runUp(runUp)
    .spacing(spacing)
    .height(scoreHeight)(gridContainer);

  notes
    .state(state)
    .data(state.showSound ? musicData : [])
    .runUp(runUp)
    .spacing(spacing)
    .height(scoreHeight)(musicContainer);

  controls
    .spacing(scoreHeight / NUM_LINES)(controlsContainer);

  hiding
    .state(state)
    .on('togglevisual', handleToggleVisual)
    .on('togglesound', handleToggleSound)(hidingContainer);

  adder
    .runUp(runUp)(adderShapesContainer);

  hints
    .showAdderHint(state.showAdderHint)
    .showHidingHint(state.showHidingHint)
    .adderContainer(adderContainer.node())
    .hidingContainer(hidingContainer.node())(hintsContainer);
}

window.addEventListener('resize', _throttle(render, 200));

calculateDimensions();
render();
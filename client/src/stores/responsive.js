import { get, readable, writable } from 'svelte/store';
import breakpoints from '../styles/brealpoints.js'

const _window = writable(null);
const matchBrkp = writable({});
const isCalculated = writable(false);

let matchBrkpState;
let _windowState;

const matchBrkpUnsubscribbe = matchBrkp.subscribe(val => {
  matchBrkpState = val;
})

const _windowUnsubscribbe = _window.subscribe(val => {
  _windowState = val;
})

function responsiveDataUpdate () {
  // const currentState = ()=>({ matchBrkp: matchBrkpState, _window: _windowState});
  _window.update(()=> ({
    nnerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  }
  ))
  matchBrkp.update(()=>{
    const point = {}
    for (let key in breakpoints) {
      point[key] = window.matchMedia(breakpoints[key]).matches;
    }
    return point;
  })
}

function initResponsive () {
  responsiveDataUpdate();
  isCalculated.update(() => true);
}

export {
  initResponsive,
  isCalculated,
  _window, //window properties
  matchBrkp // Object for mediaqueriescache
}
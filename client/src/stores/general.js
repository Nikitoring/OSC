import { createStore } from './storeFactory.js';

const [strGeneral, updateGeneral, afterGeneralUpdate] = createStore({
  pageContainer: ['intro','login', 'catmaps', 'cats', 'add cats'],
  // when Intro animations are done
  isCatAnimated: false,
  // when Values section is fully loaded (in case it's async on desktop)
  isValuesLoaded: false,
  isReady: false,
});

export { strGeneral, updateGeneral, afterGeneralUpdate };

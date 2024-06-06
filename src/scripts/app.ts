import { Transitions } from '@scripts/classes/Transitions';
import { Scroll } from './classes/Scroll';

new Transitions();
Scroll.init();

new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      console.log('Layout shift:', entry);
    }
}).observe({type: 'layout-shift', buffered: true});

console.log('App is running');
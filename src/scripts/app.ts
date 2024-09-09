import { Transitions } from '@scripts/classes/Transitions';
import { Scroll } from '@scripts/classes/Scroll';
import { gridHelper } from '@scripts/utils/gridHelper';

// Initialize the Transitions class
const transitions = new Transitions();
transitions.init();

// Initialize the Scroll class
Scroll.init();

// Initialize the Grid helper
import.meta.env.MODE === 'development' && gridHelper?.();

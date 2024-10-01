import { Transitions } from '@scripts/classes/Transitions';
import { Scroll } from '@scripts/classes/Scroll';
import GridHelper from '@locomotivemtl/grid-helper';
import tailwindConfig from '@root/tailwind.config';

// Initialize the Transitions class
const transitions = new Transitions();
transitions.init();

// Initialize the Scroll class
Scroll.init();

// Initialize the Grid helper
if (import.meta.env.MODE === 'development') {
    new GridHelper({
        columns: 'var(--grid-columns)',
        gutterWidth: `var(--grid-gutter, ${tailwindConfig?.theme?.extend?.gap?.gutter})`,
        marginWidth: `var(--grid-margin, ${tailwindConfig?.theme?.extend?.spacing?.containerMargin})`,
    });
};

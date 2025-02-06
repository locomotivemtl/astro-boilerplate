import { Transitions } from '@scripts/classes/Transitions';
import { Scroll } from '@scripts/classes/Scroll';

// Initialize the Transitions class
const transitions = new Transitions();
transitions.init();

// Initialize the Scroll class
Scroll.init();

if (import.meta.env.MODE === 'development') {
    // Dynamically import the grid-helper only in development mode
    import('@locomotivemtl/grid-helper')
        .then(({ default: GridHelper }) => {
            new GridHelper({
                columns: 'var(--grid-columns)',
                gutterWidth: `var(--spacing-gutter)`,
                marginWidth: `var(--spacing-gutter)`
            });
        })
        .catch((error) => {
            console.error('Failed to load the grid helper:', error);
        });
}

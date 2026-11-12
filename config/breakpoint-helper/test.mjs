import assert from 'node:assert/strict';

import { extractBreakpoints } from './breakpointsHelperAstroIntegration.ts';

function run(css) {
    const warnings = [];
    const result = extractBreakpoints(css, { warn: (message) => warnings.push(message) });
    return { result, warnings };
}

// Normal declarations parse and sort ascending
{
    const { result, warnings } = run(`
        @theme static {
            --breakpoint-lg: 1200px;
            --breakpoint-sm: 700px;
            --breakpoint-2xs: 340px;
        }
    `);
    assert.deepEqual(result, [
        { name: '2xs', value: 340 },
        { name: 'sm', value: 700 },
        { name: 'lg', value: 1200 }
    ]);
    assert.equal(warnings.length, 0);
}

// Duplicate: last value wins and a warning fires
{
    const { result, warnings } = run('--breakpoint-sm: 700px;\n--breakpoint-sm: 800px;');
    assert.deepEqual(result, [{ name: 'sm', value: 800 }]);
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /Duplicate --breakpoint-sm: keeping the last value \(800px\)/);
}

// Non-px values are skipped with a warning
{
    const { result, warnings } = run('--breakpoint-a: 50rem;\n--breakpoint-b: 1.5px;');
    assert.deepEqual(result, []);
    assert.equal(warnings.length, 2);
}

// Final declaration without semicolon, closing brace on the same line
{
    const { result } = run('@theme { --breakpoint-sm: 700px; --breakpoint-md: 1000px }');
    assert.deepEqual(result, [
        { name: 'sm', value: 700 },
        { name: 'md', value: 1000 }
    ]);
}

// Final declaration without semicolon, closing brace on the next line
{
    const { result } = run('@theme {\n    --breakpoint-sm: 700px\n}');
    assert.deepEqual(result, [{ name: 'sm', value: 700 }]);
}

// Declaration at end of string without semicolon
{
    const { result } = run('--breakpoint-sm: 700px');
    assert.deepEqual(result, [{ name: 'sm', value: 700 }]);
}

console.log('breakpoint-helper: all checks passed');

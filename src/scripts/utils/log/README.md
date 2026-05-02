# Logging Utilities

This directory contains two logging utilities for different use cases:

- **`logger.ts`** - Stylized console logger with colored prefixes and backgrounds
- **`domLogger.ts`** - DOM-based logger that displays logs directly on the page

## Table of Contents

- [Console Logger (`logger.ts`)](#console-logger-loggerts)
- [DOM Logger (`domLogger.ts`)](#dom-logger-domloggerts)
- [Color Formats](#color-formats)

---

## Console Logger (`logger.ts`)

A stylized console logger that enhances browser console output with colored prefixes, backgrounds, and custom styling. Perfect for debugging and development.

### Features

- ✅ Colored prefixes with custom identifiers
- ✅ Background colors with border radius and padding
- ✅ Predefined colors for different log levels (error, warn, info, debug)
- ✅ Custom text and background colors
- ✅ All standard console methods supported
- ✅ Optimized (prefixes and styles created once)

### Installation

```typescript
import { createLogger } from '#utils/log/logger.ts';
```

### Basic Usage

```typescript
// Create a logger with an ID prefix
const logger = createLogger({ id: 'LOCO', color: '#312dfb' });

logger.log('Hello world');
logger.info('Information message');
logger.warn('Warning message');
logger.error('Error message');
logger.debug('Debug message');
```

**Output:**

```
LOCO Hello world
LOCO • info Information message
LOCO • warn Warning message
LOCO • error Error message
LOCO • debug Debug message
```

### API Reference

#### `createLogger(options?: LoggerOptions): Logger`

Creates a new logger instance with optional configuration.

**Options:**

| Option            | Type         | Default                  | Description                                                                         |
| ----------------- | ------------ | ------------------------ | ----------------------------------------------------------------------------------- |
| `id`              | `string`     | `undefined`              | Prefix identifier (e.g., 'LOCO'). If not provided, no prefix is added.              |
| `color`           | `ColorInput` | `'#312dfb'`              | Custom text color for `log` method (hex or rgb).                                    |
| `backgroundColor` | `ColorInput` | `color` with 0.2 opacity | Custom background color. If not provided, uses the text color with reduced opacity. |

**Color Formats:**

- Hex: `'#312dfb'` or `'312dfb'`
- RGB: `'rgb(49, 45, 251)'` or `'rgb(49 45 251)'`
- RGBA: `'rgba(49, 45, 251, 0.5)'`

### Examples

#### With Custom Colors

```typescript
const logger = createLogger({
    id: 'APP',
    color: '#ff33ee',
    backgroundColor: '#ff33ee' // Optional: defaults to color with 0.2 opacity
});

logger.log('Custom colored log');
```

#### Without Prefix

```typescript
const logger = createLogger({ color: '#312dfb' });
logger.log('No prefix, but still colored');
```

#### Predefined Log Levels

Each log level has predefined colors:

- **Error**: Red (`#ff3333`) with red background
- **Warn**: Orange (`#ffaa00`) with orange background
- **Info**: Blue (`#3399ff`) with blue background
- **Debug**: Gray (`#999999`) with gray background
- **Log**: Custom color (default: `#312dfb`) with matching background

```typescript
const logger = createLogger({ id: 'APP' });

logger.error('This is red');
logger.warn('This is orange');
logger.info('This is blue');
logger.debug('This is gray');
logger.log('This uses your custom color');
```

#### All Available Methods

```typescript
const logger = createLogger({ id: 'APP' });

// Basic logging
logger.log('Message');
logger.info('Info');
logger.warn('Warning');
logger.error('Error');
logger.debug('Debug');

// Table display
logger.table({ name: 'John', age: 30 });

// Timing
logger.time('operation');
// ... some code ...
logger.timeEnd('operation');

// Grouping
logger.group('Group Label');
logger.log('Inside group');
logger.groupEnd();

logger.groupCollapsed('Collapsed Group');
logger.log('Inside collapsed group');
logger.groupEnd();

// Clear console
logger.clear();
```

### Styling

The logger applies the following styles to prefixes:

- **Text color**: Custom or predefined based on log level
- **Background color**: Semi-transparent (0.2 opacity) matching the text color
- **Border radius**: `4px`
- **Padding**: `2px` vertical, `6px` horizontal
- **Font weight**: Bold

---

## DOM Logger (`domLogger.ts`)

A DOM-based logger that displays logs directly on the page without requiring browser dev tools. Perfect for debugging on mobile devices or when console access is limited.

### Features

- ✅ Displays logs directly on the page
- ✅ Stacked vertically in top-left corner
- ✅ Auto-removes after customizable duration (default: 5 seconds)
- ✅ Smooth fade-in/fade-out animations
- ✅ Color-coded by log type
- ✅ Supports all log levels (log, info, warn, error, debug)
- ✅ Scrollable for long messages
- ✅ Auto-cleans up empty container

### Installation

```typescript
import { domLog } from '#utils/log/domLogger.ts';
```

### Basic Usage

```typescript
// Basic log (displays for 5 seconds)
domLog('Hello world');

// Custom duration (10 seconds)
domLog('This stays longer', { duration: 10000 });

// Different log types
domLog.info('Info message');
domLog.warn('Warning message');
domLog.error('Error message');
domLog.debug('Debug message');
```

### API Reference

#### `domLog(...args: unknown[]): void`

#### `domLog(...args: unknown[], options?: DomLogOptions): void`

Displays a log message on the page.

**Parameters:**

- `args`: Values to log (any type, will be formatted automatically)
- `options`: Optional configuration object
    - `duration`: Number of milliseconds before log disappears (default: `5000`)

**Typed Methods:**

- `domLog.info(...args, options?)` - Blue info log
- `domLog.warn(...args, options?)` - Orange warning log
- `domLog.error(...args, options?)` - Red error log
- `domLog.debug(...args, options?)` - Gray debug log

### Examples

#### Basic Logging

```typescript
domLog('Simple message');
domLog('Multiple', 'arguments', 123, { key: 'value' });
```

#### Custom Duration

```typescript
// Display for 10 seconds
domLog('Long message', { duration: 10000 });

// Display for 15 seconds
domLog.error('Important error', { duration: 15000 });
```

#### Different Log Types

```typescript
domLog('Default log');
domLog.info('Information');
domLog.warn('Warning');
domLog.error('Error occurred');
domLog.debug('Debug info');
```

#### Complex Objects

```typescript
const data = { name: 'John', age: 30, nested: { value: 42 } };
domLog('User data:', data);
// Automatically formats objects as JSON
```

#### With Custom Duration

```typescript
domLog.info('Info that stays 10 seconds', { duration: 10000 });
domLog.error('Critical error stays 20 seconds', { duration: 20000 });
```

### Styling

Logs are displayed with:

- **Position**: Fixed in top-left corner (`top: 20px`, `left: 20px`)
- **Max width**: `400px`
- **Stacking**: Vertical with `8px` gap
- **Colors**:
    - Log: White text on white background
    - Info: Blue text (`#3399ff`) on blue background
    - Warn: Orange text (`#ffaa00`) on orange background
    - Error: Red text (`#ff3333`) on red background
    - Debug: Gray text (`#999999`) on gray background
- **Background opacity**: `0.2`
- **Border**: `1px solid` matching text color
- **Border radius**: `8px`
- **Padding**: `12px` vertical, `16px` horizontal
- **Animations**: Fade in/out with slide effect
- **Max height**: `200px` with scroll for long content

### Behavior

- Logs automatically disappear after the specified duration
- Container is automatically removed when empty
- Logs stack vertically (newest at bottom)
- Smooth animations on appear/disappear
- Non-intrusive (pointer-events disabled except on log elements)

---

## Color Formats

Both loggers support the following color formats:

### Hex Colors

```typescript
'#312dfb'; // With hash
'312dfb'; // Without hash (auto-added)
```

### RGB Colors

```typescript
'rgb(49, 45, 251)'; // Standard format
'rgb(49 45 251)'; // Space-separated format
```

### RGBA Colors

```typescript
'rgba(49, 45, 251, 0.5)'; // With opacity
```

---

## Use Cases

### Console Logger

- **Development debugging** - Easy identification of log sources
- **Production logging** - Styled console output for monitoring
- **Team collaboration** - Consistent logging format across team
- **Component logging** - Different prefixes for different components

### DOM Logger

- **Mobile debugging** - View logs without dev tools
- **Demo/presentation** - Show logs directly on screen
- **User feedback** - Temporary notifications
- **Remote debugging** - Logs visible without console access

---

## Tips

1. **Console Logger**: Use descriptive IDs to identify log sources (e.g., component names, module names)
2. **DOM Logger**: Use shorter durations for less important logs to avoid clutter
3. **Color consistency**: Use the same color scheme across your application for better visual recognition
4. **Performance**: Console logger creates prefixes/styles once, so it's efficient for frequent logging
5. **DOM Logger cleanup**: The container automatically removes itself when empty, so no manual cleanup needed

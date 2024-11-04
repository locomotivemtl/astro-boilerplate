# Blocks Component

This component renders a series of content blocks. The component uses a switch statement to determine the type of block and renders the appropriate sub-component (e.g., `BlockText` or `BlockImage`). This is just an example, and you can customize the component to handle other block types as needed.

## Properties

| Prop     | Type      | Required | Default | Description                                                            |
| -------- | --------- | -------- | ------- | ---------------------------------------------------------------------- |
| `blocks` | `Block[]` | Yes      | None    | An array of block objects, each containing a type and associated data. |

## Block Object Structure

Each block object in the `blocks` array should have the following structure:

-   `type`: A string that specifies the type of block (e.g., `'text'` or `'image'`).
-   `data`: An object containing the data needed to render the block. The structure of this object varies depending on the block type.

## Example Usage

### Basic

To use the Blocks component, include it in your Astro project and pass the desired props.

```astro
---
import BlockText from './BlockText.astro';
import BlockImage from './BlockImage.astro';

const blocks = [
    { type: 'text', data: { content: 'This is a text block' } },
    { type: 'image', data: { src: '/path/to/image.jpg', alt: 'Image description' } }
];
---

<Blocks blocks={blocks} />
```

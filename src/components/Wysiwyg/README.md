# Wysiwyg Component


This component renders rich text content with a specified HTML tag, allowing for custom styling and flexibility.

## Property

| Prop         | Type     | Required | Default | Description                                           |
|--------------|----------|----------|---------|-------------------------------------------------------|
| `tag`        | `string` | False    | 'div'   | The container tag                                     |
| `body`       | `string` | False    | Null    | The Wysiwyg content to display                        |

## Example Usage

### Basic

To use the Wysiwyg component, include it in your Astro project and pass the desired props.

```astro
---
const rawHTMLString = 'Hello <strong>World</strong>'
---
<Wysiwyg
    tag="article"
    body={rawHTMLString}
    class="c-custom-class"
/>
```

## To Do

- [ ] Add default styles

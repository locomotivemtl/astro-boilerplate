# Wysiwyg Component


The Wysiwyg component renders a `<span>` to display an Wysiwyg from the sprite. The sprite is generated with the `.svg`files located in `./src/assets/svgs/`.

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
const rawHTMLString = "Hello <strong>World</strong>"
---
<Wysiwyg tag="article" body="{rawHTMLString}" />
```

## To Do

- [ ] Add default styles

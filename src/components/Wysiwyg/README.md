# Wysiwyg Component


This component renders rich text content with a specified HTML tag, allowing for custom styling and flexibility and content as a `<slot>`.

## Property

| Prop         | Type     | Required | Default | Description                                           |
|--------------|----------|----------|---------|-------------------------------------------------------|
| `tag`        | `string` | No       | `'div'` | The container tag.                                    |
| `class`      | `string` | No       | None    | Additional class names to style the component.        |

## Example Usage

### Basic

To use the Wysiwyg component, include it in your Astro project and pass the desired props and slot.

```astro
---
const rawHTMLString = 'Hello <strong>World</strong>'
---

<Wysiwyg tag="article" class="c-custom-class">
    <Fragment set:html={rawHTMLString}/>
<Wysiwyg/>
```

## To Do

- [ ] Add default styles

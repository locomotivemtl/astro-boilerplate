# Accordion Component


The Accordion component renders a `<details>` with a label within a `<summary>` tag, and content as a `<slot>`.

## Property

| Prop         | Type     | Required | Default | Description                                           |
|--------------|----------|----------|---------|-------------------------------------------------------|
| `label`      | `string` | Yes      | None    | The accordion label displayed in the summary          |
| `class`      | `string` | No       | None    | Additional class names to style the component.         |

## Example Usage

### Basic

To use the Accordion component, include it in your Astro project and pass it a label and content.

```astro
<Accordion label="Accordion label">
    Accordion content
</Accordion>
```

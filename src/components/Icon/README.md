# Icon Component

The Icon component renders a `<span>` to display an icon from the sprite. The sprite is generated with the `.svg`files located in `./src/assets/svgs/`.

## Property

| Prop    | Type     | Required | Default | Description                                    |
| ------- | -------- | -------- | ------- | ---------------------------------------------- |
| `name`  | `string` | Yes      | Null    | The name of the Icon to display.               |
| `class` | `string` | No       | None    | Additional class names to style the component. |

## Example Usage

### Basic

To use the Icon component, include it in your Astro project and pass the desired props.

```astro
<Icon name="logo" />
```

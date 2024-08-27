# Button Component


The Button component can render as a `<button>`, `<a>`, or `<div>` based on the provided props. The component supports various attributes to customize its behavior and appearance.

## Property

| Prop         | Type     | Required | Default | Description                                           |
|--------------|----------|----------|---------|-------------------------------------------------------|
| `href`       | `string` | No       | None    | The URL to which the button should link.               |
| `type`       | `string` | No       | `button`| The type of the button. Only applicable for `<button>`.|
| `target`     | `string` | No       | None    | Specifies where to open the linked document.           |
| `class`      | `string` | No       | None    | Additional class names to style the component.         |
| `tabIndex`   | `string` | No       | None    | Specifies the tab order of the element.                |
| `isStatic`   | `boolean`| No       | `'div'` | If true, renders as a `<div>`.                         |
| `ariaHidden` | `boolean`| No       | `false` | If true, hides the element from assistive technologies. |

## Example Usage

### Basic

To use the Button component, include it in your Astro project and pass the desired props.

```astro
<Button class="c-custom-button">Click Me</Button>
```

### Link Button

```astro
<Button href="/about">About Us</Button>
```

### External Link Button

```astro
<Button href="https://example.com" target="_blank">Go to Example</Button>
```

### External Link Button that applies [WCAG 2.2 G201]

The objective of this technique is to provide a warning before automatically opening a new window or tab.

```astro
<body>
    ...
    <Button href="https://example.com/" target="_blank" aria-describedby="new-win-desc">Go to Example</Button>
	...
	<div id="new-win-desc" hidden>opens in a new window</div>
</body>
```

## To Do

- [ ] Integrate icons
- [ ] Separate logic of "external" VS "_blank".

[WCAG 2.2 G201]: https://www.w3.org/WAI/WCAG22/Techniques/general/G201

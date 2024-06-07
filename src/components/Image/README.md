# Image Component


The Image component extends Astro’s built-in [`<Image />` (`astro:assets`)](https://docs.astro.build/en/guides/images/#image--astroassets) component with sensible defaults and wraps the image in a container with support for captioning.

## Property

| Prop       | Type                           | Required | Default                                                    | Description                                           |
|------------|--------------------------------|----------|------------------------------------------------------------|-------------------------------------------------------|
| `src`      | `string`                       | Yes      | None                                                        | The source path of the image.                         |
| `alt`      | `string`                       | No       | `''`                                                       | Alternative text for the image.                       |
| `width`    | `number`                       | No       | None                                                        | The width of the image.                               |
| `height`   | `number`                       | No       | None                                                        | The height of the image.                              |
| `tag`      | `'div' \| 'figure'`            | No       | `'div'`                                                    | HTML tag to wrap the image.                           |
| `caption`  | `string`                       | No       | None                                                        | Caption text for the image.                           |
| `class`    | `string`                       | No       | None                                                        | Additional class names to style the component.        |
| `sizes`    | `string`                       | No       | `'(max-width: 720px) 720px, (max-width: 1440px) 1440px, 1800px'` | Sizes attribute for responsive images.          |
| `widths`   | `number[]`                     | No       | `[720, 1440, 1800]`                                        | Array of widths for responsive images.                |
| `loading`  | `'eager' \| 'lazy'`            | No       | `'lazy'`                                                   | Image loading strategy.                               |


## Example Usage

### Basic

Image will render with its original ratio and take the full width of the parent.

```astro
<Image src="/images/photo.jpg" alt="A beautiful scenery" />
```

### Using a Figure Tag with Caption

Wraps the image in a `<figure>` tag and includes a caption(`<figcaption>`) below the image.

```astro
<Image 
    src="/images/photo.jpg" 
    alt="A beautiful scenery" 
    tag="figure" 
    caption="This is a beautiful scenery" 
/>
```

### Custom Sizes and Widths

Specifies custom [sizes and widths](https://docs.astro.build/en/guides/images/#widths) for responsive images, allowing the image to adapt to different screen sizes.

```astro
<Image 
    src="/images/photo.jpg" 
    alt="A beautiful scenery" 
    sizes="(max-width: 800px) 100vw, 800px" 
    widths={[400, 800, 1200]} 
/>
```

### Adding Custom CSS Classes

Adds custom CSS classes to the image component for additional styling, concatenated with the c-image class.

```astro
<Image 
    src="/images/photo.jpg" 
    alt="A beautiful scenery" 
    class="c-custom-class -a-modifier" 
/>
```

### Setting Specific Dimensions

Sets specific width and height for the image, ensuring it maintains these dimensions. Will force render the image in `object-fit: cover` based on the ratio dimension provided. You must specifiy both `width` and `height`.

```astro
<Image 
    src="/images/photo.jpg" 
    alt="A beautiful scenery" 
    width="800" 
    height="600" 
/>
```

### Lazy Loading

Uses lazy loading to defer the loading of the image until it is near the viewport, improving initial page load performance. When loaded, the `.c-image` element has the state class `is-loaded` added, allowing for styling based on state. See [Image.scss](Image.scss).

```astro
<Image 
    src="/images/photo.jpg" 
    alt="A beautiful scenery" 
    loading="lazy" 
/>
```

### Locomotive Scroll

Integrates the image with Locomotive Scroll, providing smooth scrolling effects.

```astro
<Image 
    src="/images/photo.jpg" 
    alt="A beautiful scenery" 
    data-scroll
/>
```

## To Do

- [ ] Add focal point support
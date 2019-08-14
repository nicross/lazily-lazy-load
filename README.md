# Lazily.js
A lazy loader for lazy developers.

This library leverages a `MutationObserver` to detect when elements are added to the DOM.
If the native `loading` attribute is supported, then it is applied.
Otherwise an `IntersectionObserver` is used to load elements as needed.

## Browser compatibility
- Works in evergreen browsers
- For IE11 compatibility, please provide polyfills for `IntersectionObserver` and `MutationObserver`
- Otherwise encourage your users to dump older browsers

## Usage
Simply add to the document `<head>`:

```html
<script src="path/to/Lazily.js"></script>
```

## Next Steps
- JSDoc comments
- Integrations tests
- Uglification build step within the `dist/` directory
- Contribution guidelines
- Additional element support (e.g. `<iframe>`, `<picture>`, `<video>`)

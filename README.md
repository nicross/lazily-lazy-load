# Lazily.js
A lazy loader for lazy developers.

This library leverages a `MutationObserver` to detect when elements are added to the DOM.
If the native `loading` attribute is supported, then it is applied.
Otherwise an `IntersectionObserver` is used to load elements as needed.

## Browser compatibility
- Compatible with all evergreen browsers
- For IE11 compatibility, please provide polyfills for `IntersectionObserver` and `MutationObserver`
- Otherwise encourage your users to dump their outdated browsers

## Standard usage
Simply add the minified script to the document `<head>`:

```html
<script src=".../dist/Lazily.min.js"></script>
```

For certain setups, it may be advantageous to include it inline.

## Next steps
- JSDoc comments
- Integrations tests
- Uglification build step within the `dist/` directory
- Contribution guidelines
- Additional element support (e.g. `<picture>`, `<video>`)

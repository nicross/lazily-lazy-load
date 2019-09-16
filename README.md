# lazilyLoader.js
A lazy loader for lazy folks.

This library leverages a `MutationObserver` to detect when its target elements are added to the DOM.
If the native `loading` attribute is supported, then it is applied.
Otherwise an `IntersectionObserver` is used to load them as needed.

## Compatibility
- Compatible with all evergreen browsers
- For IE11, please provide polyfills for `IntersectionObserver` and `MutationObserver`
- Earlier browsers may require transpilation and additional polyfills

## Usage
Simply add the minified script to the document `<head>`.
For certain setups, it may be advantageous to include it inline:

```html
<head>
  <script src=".../dist/lazilyLoader.min.js"></script>
</head>
```

No other markup changes are required.
It will automatically lazy load `<iframe>`, `<img>`, `<picture>`, and `<video>` elements in supported browsers.

### API
- `lazilyLoader.forceLoad()` - Forces all observed elements to load.
- `lazilyLoader.isSupported()` - Returns `true` if the library is working.

## Credits
Inspired by [this tutorial](https://shiftbacktick.io/code/2019/08/17/lazily-lazy-loading.html).

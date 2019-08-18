const Lazily = (function IIFE(undefined) {
  'use strict'

  const initializedKey = 'lazily'
  const lazyAttributes = ['src', 'srcset']

  const isSupported = 'IntersectionObserver' in window
    && 'MutationObserver' in window

  const mutationObserver = isSupported
    ? new MutationObserver(onMutation)
    : undefined

  const intersectionObserver = isSupported
    ? new IntersectionObserver(onIntersection, {rootMargin: '50%'})
    : undefined

  if (isSupported) {
    mutationObserver.observe(document.documentElement, {
      childList: true,
      subtree: true,
    })

    window.matchMedia('print').addListener(function (e) {
      if (e.matches) {
        forceLoad()
      }
    })
  }

  function onMutation(entries) {
    entries.forEach(function (entry) {
      [].slice.call(
        entry.addedNodes
      ).forEach(function (node) {
        if (node instanceof HTMLIFrameElement || node instanceof HTMLImageElement) {
          initialize(node)
        }
      })
    })
  }

  function initialize(element) {
    if (initializedKey in element.dataset) {
      return
    }

    element.dataset[initializedKey] = ''

    if ('loading' in element) {
      if (!element.hasAttribute('loading')) {
        element.setAttribute('loading', 'lazy')
      }
      return
    }

    lazyAttributes.forEach(function swapToData(key) {
      if (element.hasAttribute(key)) {
        element.dataset[key] = element[key]
        element.removeAttribute(key)
      }
    })

    intersectionObserver.observe(element)
  }

  function onIntersection(entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        load(entry.target)
      }
    })
  }

  function load(element) {
    intersectionObserver.unobserve(element)

    lazyAttributes.forEach(function swapFromData(key) {
      if (key in element.dataset) {
        element[key] = element.dataset[key]
        delete element.dataset[key]
      }
    })
  }

  function forceLoad() {
    [].slice.call(
      intersectionObserver.takeRecords()
    ).forEach(function (entry) {
      load(entry.target)
    })
  }

  return {
    forceLoad: function () {
      if (isSupported) {
        forceLoad()
      }

      return this
    },
    isSupported: function () {
      return isSupported
    },
  }
})()

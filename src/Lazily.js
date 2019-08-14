const Lazily = (function IIFE(undefined) {
  'use strict'

  const initializedKey = 'lazily'
  const lazyAttributes = ['src', 'srcset']

  const isSupported = 'querySelectorAll' in document
    && 'IntersectionObserver' in window
    && 'MutationObserver' in window

  const isNative = 'loading' in HTMLImageElement.prototype

  const mutationObserver = isSupported
    ? new MutationObserver(onMutation)
    : undefined

  const intersectionObserver = isSupported && !isNative
    ? new IntersectionObserver(onIntersection, {rootMargin: '50%'})
    : undefined

  if (isSupported) {
    mutationObserver.observe(document.documentElement, {
      childList: true,
    })
  }

  function onMutation(entries) {
    entries.forEach(function (entry) {
      [].slice.call(entry.addedNodes).forEach(function (node) {
        if (!(node instanceof Element)) {
          return
        }

        if (node instanceof HTMLImageElement) {
          return initialize(node)
        }

        [].slice.call(
          node.querySelectorAll('img')
        ).forEach(initialize)
      })
    })
  }

  function initialize(element) {
    if (initializedKey in element.dataset) {
      return
    }

    element.dataset[initializedKey] = ''

    if (isNative) {
      if (!element.hasAttribute('loading')) {
        element.setAttribute('loading', 'lazy')
      }
      return
    }

    lazyAttributes.forEach(function (key) {
      if (key in element) {
        element.dataset[key] = element[key] || ''
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

    lazyAttributes.forEach(function (key) {
      if (key in element.dataset) {
        element[key] = element.dataset[key]
        delete element.dataset[key]
      }
    })
  }

  return {
    forceLoad: function () {
      if (intersectionObserver) {
        [].slice.call(
          intersectionObserver.takeRecords()
        ).forEach(function (entry) {
          load(entry.target)
          onLoad.call(element)
        })
      }

      return this
    },
    getIntersectionObserverEntries: function () {
      if (intersectionObserver) {
        return intersectionObserver.takeRecords()
      }
    },
    isNative: function () {
      return isNative
    },
    isSupported: function () {
      return isSupported
    },
  }
})()

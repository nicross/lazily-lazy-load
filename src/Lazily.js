const Lazily = (function IIFE(undefined) {
  'use strict'

  const initializedKey = 'lazily'
  const lazyAttributes = ['src', 'srcset']
  const tagNames = ['img', 'iframe']

  const isSupported = 'querySelectorAll' in document
    && 'IntersectionObserver' in window
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
    })
    window.addEventListener('beforeprint', forceLoad)
  }

  function onMutation(entries) {
    entries.forEach(function (entry) {
      [].slice.call(entry.addedNodes).forEach(function (node) {
        if (!(node instanceof Element)) {
          return
        }

        const tagName = node.tagName.toLowerCase()

        if (tagNames.indexOf(tagName) != -1) {
          return initialize(node)
        }

        [].slice.call(
          node.querySelectorAll(tagNames.join(','))
        ).forEach(initialize)
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

    lazyAttributes.forEach(function swapFromData(key) {
      if (key in element.dataset) {
        element[key] = element.dataset[key]
        delete element.dataset[key]
      }
    })
  }

  function forceLoad() {
    getObserved().forEach(function (element) {
      load(element)
    })
  }

  function getObserved() {
    if (!intersectionObserver) {
      return []
    }

    return [].slice.call(
      intersectionObserver.takeRecords()
    ).map(function (entry) {
      return entry.target
    })
  }

  return {
    forceLoad: function () {
      forceLoad()
      return this
    },
    getObserved: function () {
      return getObserved()
    },
    isSupported: function () {
      return isSupported
    },
  }
})()

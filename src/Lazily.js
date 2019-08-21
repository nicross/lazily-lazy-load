const Lazily = (function IIFE(undefined) {
  'use strict'

  const initializedKey = 'lazily'

  const lazyElements = {
    iframe: function (element, swap) {
      swap(element, ['src'])
    },
    img: function (element, swap) {
      swap(element, ['src', 'srcset'])
    },
    picture: function (element, swap) {
      [].slice.call(
        element.querySelectorAll('source')
      ).forEach(function (source) {
        swap(source, ['src', 'srcset'])
      })
    },
    video: function (element, swap) {
      [].slice.call(
        element.querySelectorAll('source')
      ).forEach(function (source) {
        swap(source, ['src'])
      })

      swap(element, ['poster', 'src'])
    },
  }

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
        if (node instanceof Element && node.tagName.toLowerCase() in lazyElements) {
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

    const tagName = element.tagName.toLowerCase()
    lazyElements[tagName](element, swapToData)

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

    const tagName = element.tagName.toLowerCase()
    lazyElements[tagName](element, swapFromData)
  }

  function forceLoad() {
    [].slice.call(
      intersectionObserver.takeRecords()
    ).forEach(function (entry) {
      load(entry.target)
    })
  }

  function swapFromData(element, keys) {
    keys.forEach(function (key) {
      if (key in element.dataset) {
        element[key] = element.dataset[key]
        delete element.dataset[key]
      }
    })
  }

  function swapToData(element, keys) {
    keys.forEach(function (key) {
      if (element.hasAttribute(key)) {
        element.dataset[key] = element[key]
        element.removeAttribute(key)
      }
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

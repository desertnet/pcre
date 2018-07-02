!(function () {
  const {resolve} = require('path')

  Module.locateFile = function (file) {
    return resolve(__dirname, file)
  }

  Module.loaded = new Promise(resolve => {
    Module.onRuntimeInitialized = resolve
  })
})()

/* global Module */

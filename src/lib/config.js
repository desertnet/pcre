!(function () {
  const {resolve} = require('path')

  Module.locateFile = function (file) {
    return resolve(__dirname, file)
  }
})()

/* global Module */

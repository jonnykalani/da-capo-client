'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
const userEvents = require('./auth/auth-events')
const forumEvents = require('./forums/forum-events')

$(() => {
  setAPIOrigin(location, config)
  userEvents.addHandlers()
  forumEvents.addHandlers()
  $('.modal').on('hidden.bs.modal', () => $('form').find('input:not([type="submit"])').val(''))
  $('.modal').on('hidden.bs.modal', () => $('textarea').val(''))
})

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')

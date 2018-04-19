'use strict'

Handlebars.registerHelper('isSameUser', function () {
  if (this.comment._owner === currentUser) {
    return true
  } else {
    return false
  }
})

'use strict'

const api = require('./auth-api')
const getFormFields = require('../../../lib/get-form-fields')
const ui = require('./auth-ui')
const store = require('../store.js')
const forumApi = require('../forums/forum-api')

const onSignUp = function (event) {
  event.preventDefault()
  // event.target is the same as this in the parameter below
  const data = getFormFields(this)
  api.signUp(data)
    .then(ui.signUpSuccess)
    .catch(ui.signUpFailure)
}

const onSignIn = function (event) {
  event.preventDefault()
  // event.target is the same as this in the parameter below
  const data = getFormFields(this)
  api.signIn(data)
    .then(ui.signInSuccess)
    .catch(ui.signInFailure)
}

const onChangePassword = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)

  api.changePassword(data)
    .then(ui.changePasswordSuccess)
    .catch(ui.changePasswordFailure)
}

const onSignOut = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)

  api.signOut(data)
    .then(ui.signOutSuccess)
    .catch(ui.signOutFailure)
}

const onViewUserInfo = function (event) {
  event.preventDefault()
  console.log('onViewUserInfo is running')
  const data = getFormFields(event.target)
  store.viewed_user = data.users
  api.getUser(data.users.user_id)
    .then(ui.viewOrgInfo)
    .then(() => {
      return forumApi.getOwnedForums(data.users.user_id)
    })
    .then(ui.showForums)
    .catch(console.error)
}

const addHandlers = () => {
  $('#sign-up').on('submit', onSignUp)
  $('#sign-in').on('submit', onSignIn)
  $('#change-password').on('submit', onChangePassword)
  $('#sign-out').on('submit', onSignOut)
  $('.view-user-info').on('click', onViewUserInfo)
}

module.exports = {
  addHandlers,
  onViewUserInfo
}

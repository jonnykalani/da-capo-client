'use strict'
const store = require('../store')
const api = require('./auth-api.js')
// above is for the token as well

const signUpSuccess = function (data) {
  // $('#message').text('Signed up and signed in successfully!')
  // $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('#sign-up-modal').modal('hide')
  // $('#message').delay(3000).slideToggle()
  const myNewData = { // made a new const called myNewData
    'credentials': { // used credentials from the shell files
      'email': $('#username-id-create').val(), // calls value of username-id-create and stores it in email
      'password': $('#password-id-create').val() // val calls password id create  and stores it in password
    }
  }
  api.signIn(myNewData) // scriptsApi calls api.js ... then calls the sign in function inside of the file.... then uses the myNewData const as the parameter
    .then(signInSuccess) // .then will use the sign in success function
    .catch(signInFailure) // .catch will be the failure part !!

  // $('form').find('input:not([type="submit"])').val('')
  // userDropdown()
}

const signUpFailure = function (error) {
  store.error = error
  $('#sign-up-modal').modal('hide')
  $('#message').text('Error on signing up!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(3000).slideToggle()
}

const signInSuccess = function (data) {
  $('.signed-in-buttons').delay(300).slideToggle('slow')
  $('.signed-out-buttons').hide()
  $('#message').text('you\'re signed in     :)')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(1600).slideToggle()
  // below is for the token
  store.user = data.user
  // $('#sign-in').val('')
}

const signInFailure = function (error) {
  store.error = error
  $('#message').text('wrong email or password')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(3000).slideToggle()
  // $('#sign-in').val('')
}

const changePasswordSuccess = function (data) {
  $('#message').text('Changed password successfully!')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(3000).slideToggle()
  // $('#sign-in').val('')
}

const changePasswordFailure = function (error) {
  store.error = error
  $('#message').text('Error on changing password!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(3000).slideToggle()
}

const signOutSuccess = function (data) {
  $('#message').text('you\'re signed out. please come back :(')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
  $('.signed-in-buttons').hide()
  $('.signed-out-buttons').show()
  $('.jump-ahead-slogan').show()
  $('#message').delay(2000).slideToggle()
  $('#content').empty()
  store.user = null
}

const signOutFailure = function (error) {
  store.error = error
  $('#message').text('Error on signing out!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(3000).slideToggle()
}

module.exports = {
  signUpSuccess,
  signUpFailure,
  signInSuccess,
  changePasswordSuccess,
  changePasswordFailure,
  signInFailure,
  signOutSuccess,
  signOutFailure
}

'use strict'

const config = require('../config.js')
const store = require('../store')

let token

const signUp = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/sign-up/',
    method: 'POST',
    headers: {
      contentType: 'application/json'
    },
    data: data
  })
}

const signIn = function (data) {
  console.log('config.apiOrigins is ', config.apiOrigins)
  return $.ajax({
    url: config.apiOrigin + '/sign-in/',
    method: 'POST',
    headers: {
      contentType: 'application/json'
    },
    data: data
  })
}

const changePassword = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/change-password/' + store.user.id,
    method: 'PATCH',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    },
    data: data
  })
}

const signOut = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/sign-out/' + store.user.id,
    method: 'DELETE',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const userIndex = function () {
  token = ''
  if (store.user) {
    token = store.user.token
  }
  return $.ajax({
    url: config.apiOrigin + '/users',
    method: 'GET',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + token
    }
  })
}

const getUser = function (data) {
  token = ''
  if (store.user) {
    token = store.user.token
  }
  // if (data.webpage) {
  //   id = data.webpage.id
  // } else {
  //   id = data
  // }
  return $.ajax({
    url: config.apiOrigin + '/users/' + data,
    method: 'GET',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + token
    }
  })
}

module.exports = {
  signUp,
  signIn,
  changePassword,
  signOut,
  userIndex,
  getUser
}

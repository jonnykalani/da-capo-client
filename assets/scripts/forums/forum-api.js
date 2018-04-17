'use strict'

const config = require('../config')
const store = require('../store')

let token

const createForum = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/forums/',
    method: 'POST',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    },
    data
  })
}

const getForums = function () {
  token = ''
  if (store.user) {
    token = store.user.token
  }
  return $.ajax({
    url: config.apiOrigin + '/forums',
    method: 'GET',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + token
    }
  })
}

const getForum = function (data) {
  token = ''
  if (store.user) {
    token = store.user.token
  }
  // if (data.forum) {
  //   id = data.forum.id
  // } else {
  //   id = data
  // }
  return $.ajax({
    url: config.apiOrigin + '/forums/' + data,
    method: 'GET',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + token
    }
  })
}

const getOwnedForums = function (data) {
  token = ''
  if (store.user) {
    token = store.user.token
  }
  // if (data.forum) {
  //   id = data.forum.id
  // } else {
  //   id = data
  // }
  return $.ajax({
    url: config.apiOrigin + '/ownedforums/' + data,
    method: 'GET',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + token
    }
  })
}

const deleteForum = function (data) {
  // if (data.forum) {
  //   id = data.forum.id
  // } else {
  //   id = data
  // }
  return $.ajax({
    url: config.apiOrigin + '/forums/' + data,
    method: 'DELETE',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

const updateForum = function (data) {
  return $.ajax({
    url: config.apiOrigin + '/forums/' + data.forum.id,
    method: 'PATCH',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    },
    data
  })
}

module.exports = {
  getForums,
  getForum,
  getOwnedForums,
  deleteForum,
  createForum,
  updateForum
}

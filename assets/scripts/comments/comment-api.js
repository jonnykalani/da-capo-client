'use strict'

const config = require('../config')
const store = require('../store')
let token

const createComment = function (data) {
  console.log('data in createComment is', data)
  return $.ajax({
    url: config.apiOrigin + '/comments/',
    method: 'POST',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    },
    data: {
      comment: {
        body: data.comment.body,
        forum: data.forum._id
      }
    }
  })
}

const getOwnedComments = function (data) {
  token = ''
  if (store.user) {
    token = store.user.token
  }
  return $.ajax({
    url: config.apiOrigin + '/forumcomments/' + data,
    method: 'GET',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + token
    }
  })
}

const deleteComment = function (data) {
  console.log('data in delete api is', data)
  // if (data.forum) {
  //   id = data.forum.id
  // } else {
  //   id = data
  // }
  return $.ajax({
    url: config.apiOrigin + '/comments/' + data,
    method: 'DELETE',
    headers: {
      contentType: 'application/json',
      Authorization: 'Token token=' + store.user.token
    }
  })
}

module.exports = {
  createComment,
  getOwnedComments,
  deleteComment
}

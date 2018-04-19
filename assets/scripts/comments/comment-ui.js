'use strict'

const showOneForumTemplate = require('../templates/forum.hbs')
const forumInfoTemplateWithButtons = require('../templates/forum-with-buttons.hbs')
const events = require('./comment-events.js')
const store = require('../store.js')
let forumData
let currentUser

const commentsContentTemplate = require('../templates/forum-comments.hbs')

const commentSuccess = function (data) {
  console.log('data.comment._forum in commentSuccess is', data.comment._forum)
  getForumSuccess(data.comment._forum)
}

const getOwnedComments = function (data) {
  const commentsContent = commentsContentTemplate({
    comments: data.comments
  })
  $('#message').text('comments updated')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('#message').delay(2000).slideToggle()
  console.log('data.comments in getownedComments is', data.comments)
  $('#comments-div').html(commentsContent)
}

const getForumSuccess = function (data) {
  const ownerOfViewedBlog = data.forum._owner
  currentUser = store.user.id
  console.log('in getForumSuccess data.forum is', data.forum)
  console.log('data.forum.comments in getForumSuccess is', data.forum.comments)
  if (ownerOfViewedBlog === currentUser) {
    forumData = forumInfoTemplateWithButtons({
      forum: data.forum.body,
      user: store.user.email,
      comments: data.forum.comments
      // commentUser: data.forum.comments
    })
    console.log('it thinks it belongs to current user')
    $('#update-forum-submit').data(data.forum.body.id) // set data-id to data.forum.id
  } else {
    forumData = showOneForumTemplate({
      forum: data.forum.body,
      user: data.forum._owner,
      comments: data.forum.comments
      // commentUser: data.forum.comment
    })
    console.log('it thinks it does not belong to current user')
  }
  $('#message').text('forum loaded')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('#message').delay(2000).slideToggle()
  $('#content').html(forumData)
  $('#forum-update-open-modal').on('click', () => {
    $('.update-forum-modal').modal('show')
  })
  // $('#update-forum-submit').on('submit', onUpdateForum)
  $('#comment-submit').on('submit', events.comment)
  $('#confirm-delete-comment').data(data.forum.body.id) // set data-id to data.forum.id
}
// const commentSuccess = function () {
//
// }

module.exports = {
  getOwnedComments,
  commentSuccess,
  getForumSuccess
}

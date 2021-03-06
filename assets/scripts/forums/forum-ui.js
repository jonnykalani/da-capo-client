'use strict'

const store = require('../store.js')
const compare = require('../customsorterforposts.js')
const api = require('./forum-api.js')
const getFormFields = require('../../../lib/get-form-fields')
// const link = require('./linking-file.js')
// const commentEvents = require('../comments/comment-events.js')
const commentApi = require('../comments/comment-api.js')

const userIsCommenter = require('../templates/user-is-commenter.hbs')
const userNotCommenter = require('../templates/user-not-commenter.hbs')

const forumInfoTemplate = require('../templates/forums.hbs')
const showOneForumTemplate = require('../templates/forum.hbs')
const forumInfoTemplateWithButtons = require('../templates/forum-with-buttons.hbs')
let forumInfoData
let identifyForum
let currentUser
let forumId

const createForumSuccess = function (data) {
  $('#create-forum-modal').modal('hide')
  $('#message').text('Created forum successfully!')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#content').empty()
  $('#message').delay(2000).slideToggle()
  api.getForums()
    .then(showForums)
}

const createForumFailure = function (error) {
  store.error = error
  $('#create-forum-modal').modal('hide')
  $('#message').text('Error on creating a forum!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(2000).slideToggle()
}
const getForumsSuccess = function (data) {
  console.log('getForumsSuccess is running')
  $('#message').text('forums loaded')
  $('#message').delay(2000).slideToggle()
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
}

const getForumsFailure = function (error) {
  store.error = error
  $('#message').text('Error on retrieving forums!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
}

const getForum = function (event) {
  event.preventDefault()
  forumId = event.target.dataset.id
  identifyForum = event.target.dataset
  console.log('id in getForum is', forumId)
  console.log('event.target.dataset is', event.target.dataset)
  api.getForum(forumId)
    .then((response) => {
      getForumSuccess(response)
      console.log('response to pass from getForum to getForumSuccess is', response)
    })
  // commentEvents.getOwnedComments(forumId)
}

let forumData
let commentTemplate
let notCommenterTemplate
let isCommenterTemplate

const getForumSuccess = function (data) {
  const ownerOfViewedBlog = data.forum._owner
  currentUser = store.user.id

  const commentsArray = data.forum.comments
  console.log('commentsArray is', commentsArray)

  const checkIfUserIsCommenter = function (array) {
    $('#comments-div').empty()
    array.sort(compare)
    for (let i = 0; i < array.length; i++) {
      if (array[i]._owner === currentUser) {
        $('#comments-div').append(userIsCommenter({
          forum: data.forum,
          user: store.user.email,
          comment: array[i]
        }))
        console.log('it thinks comment owner is current user and array[i]._owner is', array[i]._owner)
      } else {
        $('#comments-div').append(userNotCommenter({
          forum: data.forum,
          user: store.user.email,
          comment: array[i],
          currentUser: store.user.id
        }))
        console.log('it thinks comment owner is NOT user and array[i]._owner is', array[i]._owner)
      }
    }
  }

  checkIfUserIsCommenter(commentsArray)

  if (ownerOfViewedBlog === currentUser) {
    forumData = forumInfoTemplateWithButtons({
      forum: data.forum,
      user: store.user.email,
      comments: data.forum.comments,
      currentUser: store.user.id
    })
    console.log('it thinks it belongs to current user')
    $('#update-forum-submit').data(data.forum.body.id) // set data-id to data.forum.id
    $('.delete-comment-simple').on('submit', deleteComment)
    // $('body').on('click', '.delete-comment-simple', deleteComment)
  } else {
    forumData = showOneForumTemplate({
      forum: data.forum,
      user: data.forum._owner,
      comments: data.forum.comments,
      currentUser: store.user.id
      // commentUser: data.forum.comment
    })
    $('.delete-comment-simple').on('submit', deleteComment)
    // $('body').on('click', '.delete-comment-simple', deleteComment)
  }
  $('#message').text('forum loaded')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('#message').delay(2000).slideToggle()
  $('#content').html(forumData).css('opacity', .25)
    .animate({
      opacity: 1
    }, 1000)

  $('#forum-update-open-modal').on('click', () => {
    $('.update-forum-modal').modal('show')
  })
  $('#update-forum-submit').on('submit', onUpdateForum)
  $('#comment-submit').data(data.forum._id)
  $('.comment-submit').on('submit', comment)
  $('.show-all-forums-button').on('click', () => {
    api.getForums()
      .then(showForums)
  })
  // $('#confirm-delete-comment').on('submit', commentEvents.delete) // set data-id to data.forum.id
  // $('.delete-comment-simple').on('submit', () => {
  //   console.log('delete was clicked')
  // })
}

const onUpdateForum = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  // console.log('identifyForum is', identifyForum)
  currentUser = store.user.id
  data.forum.id = identifyForum.id
  data.forum._owner = currentUser
  console.log('event.target in onUpdateForum is', data)
  console.log('THIS FORUM IS UPDATING')
  $('.update-forum-modal').modal('hide')
  api.updateForum(data)
    .then(updateForumSuccess)
    .then(() => {
      return api.getForum(forumId)
    })
    // .then(getForumSuccessAfterUpdate)
    .then(getForumSuccess)
    .catch(updateForumFailure)
}

const getForumFailure = function () {
  // store.error = error
  $('#message').text('Error on retrieving forum!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
}

const updateForumSuccess = function () {
  // event.preventDefault()
  $('.update-forum-modal').modal('hide')
  $('#message').text('forum updated')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(2000).slideToggle()
  // $('#content').empty()
  // getForum(data)
  // return data
}

const updateForumFailure = function () {
  // console.log(error)
  $('.update-forum-modal').modal('hide')
  $('#message').text('Error on updating forum!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(2000).slideToggle()
}

const deleteForumSuccess = function (data) {
  $('#confirmDeleteForumModal').modal('hide')
  $('#message').text('Deleted forum successfully!')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(2000).slideToggle()
}

const deleteForumFailure = function () {
  // console.log(error)
  $('#confirmDeleteForumModal').modal('hide')
  $('#message').text('Error on deleting forum!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(2000).slideToggle()
}

const showForums = function (data) {
  data.forums.sort(compare)
  forumInfoData = forumInfoTemplate({
    forums: data.forums,
    user: data.forums._owner
  })
  $('form').find('input:not([type="submit"])').val('')
  $('#content').html(forumInfoData)
    .css('opacity', .25)
    .animate({
      // left: '+=50',
      opacity: 1
    }, 1000)
  $('#message').text('forums loaded')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('#message').delay(2000).slideToggle()
  $('form').find('input:not([type="submit"])').val('')
  $('.show-one-forum-button').on('click', getForum)
  console.log('end of show forums')
  return data
}

const comment = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  console.log('data.forum._id in comment is', data.forum._id)
  console.log('data in comment is', data)
  commentApi.createComment(data)
    .then((data) => {
      console.log('data back from API in comment is', data)
      console.log('data.comment._forum in comment:', data.comment._forum)
      api.getForum(data.comment._forum)
        .then((response) => {
          getForumSuccess(response)
          console.log('response to pass from comment to getForumSuccess is', response)
        })
        .catch(console.error)
    })
}

let deleteCommentVariable
const deleteComment = function (event) {
  event.preventDefault()
  deleteCommentVariable = event.target[0].dataset.id
  console.log('event.target[0].dataset.id is', event.target[0].dataset.id)
  console.log('deleteCommentVariable is', deleteCommentVariable)
  api.deleteComment(deleteCommentVariable)
    .then(() => {
      return api.getForum(forumId)
    })
    .then((response) => {
      getForumSuccess(response)
      console.log('response to pass from deleteComment to getForumSuccess is', response)
    })
    .catch(console.error)
}

module.exports = {
  createForumSuccess,
  createForumFailure,
  getForumsSuccess,
  getForumsFailure,
  getForumSuccess,
  getForumFailure,
  updateForumSuccess,
  updateForumFailure,
  // identifyForumToUpdate,
  deleteForumSuccess,
  deleteForumFailure,
  showForums,
  deleteComment
}

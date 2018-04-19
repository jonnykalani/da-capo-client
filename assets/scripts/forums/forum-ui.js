'use strict'

const store = require('../store.js')
const compare = require('../customsorterforposts.js')
const api = require('./forum-api.js')
const getFormFields = require('../../../lib/get-form-fields')
// const link = require('./linking-file.js')
const commentEvents = require('../comments/comment-events.js')
const commentApi = require('../comments/comment-api.js')

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

const getForumSuccess = function (data) {
  console.log('data in getForumSuccess is', data)
  const ownerOfViewedBlog = data.forum._owner
  currentUser = store.user.id
  console.log('in getForumSuccess data.forum is', data.forum)
  console.log('data.forum.body in getForumSuccess is', data.forum.body)
  console.log('data.forum is', data.forum)
  console.log('data.forum.comments is', data.forum.comments)
  if (ownerOfViewedBlog === currentUser) {
    forumData = forumInfoTemplateWithButtons({
      forum: data.forum,
      user: store.user.email,
      comments: data.forum.comments
      // commentUser: data.forum.comments
    })
    console.log('it thinks it belongs to current user')
    $('#update-forum-submit').data(data.forum.body.id) // set data-id to data.forum.id
    // $('#delete-comment-open-modal').on('click', () => {
      // console.log('delete modal should open')
      // $('.confirm-delete-modal').modal('show')
      // $(this).find('.delete-comment-simple').on('submit', deleteComment)
    // })
    $('body').on('click', '.delete-comment-simple', deleteComment)
  } else {
    forumData = showOneForumTemplate({
      forum: data.forum,
      user: data.forum._owner,
      comments: data.forum.comments
      // commentUser: data.forum.comment
    })
    console.log('it thinks it does not belong to current user')
    // $('#delete-comment-open-modal').on('submit', () => {
      // console.log('delete button was clicked')
      // $('.confirm-delete-modal').modal('show')

      // $(this).find('.delete-comment-simple').on('submit', (event) => {
      //   console.log('event is', event)
      //   deleteComment(event)
      // })
    // })
    $('body').on('click', '.delete-comment-simple', deleteComment)
  }
  $('#message').text('forum loaded')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('#message').delay(2000).slideToggle()
  $('#content').html(forumData)
  $('#forum-update-open-modal').on('click', () => {
    $('.update-forum-modal').modal('show')
  })
  $('#update-forum-submit').on('submit', onUpdateForum)
  $('#comment-submit').on('submit', comment)
  // $('#confirm-delete-comment').on('submit', commentEvents.delete) // set data-id to data.forum.id
  // $('.delete-comment-simple').on('submit', () => {
  //   console.log('delete was clicked')
  // })
}

const getForumSuccessAfterUpdate = function (data) {
  console.log('data in getForumSuccess is', data)
  const ownerOfViewedBlog = data.forum._owner
  currentUser = store.user.id
  if (ownerOfViewedBlog === currentUser) {
    forumData = forumInfoTemplateWithButtons({
      forum: data.forum.body,
      user: data.forum._owner})
    console.log('it thinks it belongs to current user')
  } else {
    forumData = showOneForumTemplate({
      forum: data.forum.body,
      user: data.forum._owner
    })
    console.log('it thinks it does not belong to current user')
  }
  // $('#message').text('forum loaded')
  // $('#message').removeClass('alert-danger').addClass('alert-success').show()
  // $('#message').delay(2000).slideToggle()
  $('#content').html(forumData)
  // $('#forum-update-open-modal').on('click', () => {
  //   $('.update-forum-modal').modal('show')
  // })
  // $('#update-forum-submit').on('submit', onUpdateForum)
}

// const identifyForumToUpdate = function (event) {
//   event.preventDefault()
//   const updateID = event.target.dataset.id
//   api.getForum(updateID)
//     .then(onUpdateForum)
//     .catch(updateForumFailure)
// }

const onUpdateForum = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  // console.log('identifyForum is', identifyForum)
  currentUser = store.user.id
  data.forum.id = identifyForum.id
  data.forum._owner = currentUser
  console.log('event.target.dataset in onUpdateForum is', data)
  $('.update-forum-modal').modal('hide')
  api.updateForum(data)
    .then(updateForumSuccess)
    .then(() => {
      return api.getForum(forumId)
    })
    .then(getForumSuccessAfterUpdate)
    .catch(updateForumFailure)
  // link.getForum(identifyForum)
  // .then(() => updateForumSuccess())
  // $('#content').empty()
  // api.getForums()
  //   .then(showForums)
  //   .then(getForumsSuccess)
  // .catch(getForumsFailure)
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
  // if (store.user) {
  //   if (store.user.id === store.viewed_user.user_id) {
  //     forumInfoData = forumInfoTemplateWithButtons({ forums: data.forums,
  //       user: store.viewed_user.user_id})
  //   } else {
  //     forumInfoData = forumInfoTemplate({ forums: data.forums,
  //       user: store.viewed_user.user_id})
  //   }
  // } else {
  //   forumInfoData = forumInfoTemplate({ forums: data.forums,
  //     user: store.viewed_user.user_id})
  // }
  $('form').find('input:not([type="submit"])').val('')
  $('#content').html(forumInfoData)
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
  // const dataId = getFormFields(event.target.value)
  deleteCommentVariable = event.target.value
  console.log('event.target is', event.target)
  console.log('deletion event.target.name is', event.target.name)
  // let forumIdAfterDeletion = event.target.name
  api.deleteComment(deleteCommentVariable)
    .catch(console.error)
    // .then(() => {
  api.getForum(forumId)
    // })
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

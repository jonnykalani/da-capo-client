'use strict'

const api = require('./comment-api')
const getFormFields = require('../../../lib/get-form-fields')
const ui = require('./comment-ui')

const comment = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  console.log('data.comment in comment is', data.comment)
  api.createComment(data)
    .then(ui.commentSuccess)
}

const getOwnedComments = function (forumId) {
  console.log('forumId in getOwnedComments is', forumId)
  api.getOwnedComments(forumId)
    .then(ui.getOwnedComments)
}

const deleteComment = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  api.delete(data)
}

let deletionId

const identifyCommentToRemove = function (event) {
  event.preventDefault()
  // currentEvent = event
  deletionId = event.target.dataset.id
  $('#confirmDeleteImageModal').modal('show')
}

const removeComment = function (event) {
  api.deleteComment(deletionId)
    .then(webpagesUI.deleteWebpageSuccess)
    .then(viewMain.goBackToMain)
    .catch(webpagesUI.deleteWebpageFailure)
  // .then(webpagesEvents.onWebpageMaintainedIndex)
  // .catch(webpagesUI.webpageDeleteFailure)
}


const addHandlers = () => {
  // $('body').on('click', '.delete-comment-simple', identifyCommentToRemove)
}

module.exports = {
  comment,
  getOwnedComments,
  deleteComment,
  addHandlers,
  removeComment
}

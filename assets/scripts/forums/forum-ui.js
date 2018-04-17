'use strict'

const store = require('../store.js')
const compare = require('../customsorterforposts.js')

const forumInfoTemplate = require('../templates/forums.hbs')
const forumInfoTemplateWithButtons = require('../templates/forums-with-buttons.hbs')
let forumInfoData

const createForumSuccess = function (data) {
  $('#create-forum-modal').modal('hide')
  $('#message').text('Created forum successfully!')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#content').empty()
  $('#message').delay(3000).slideToggle()
}

const createForumFailure = function (error) {
  store.error = error
  $('#create-forum-modal').modal('hide')
  $('#message').text('Error on creating a forum!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(3000).slideToggle()
}
const getForumsSuccess = function (data) {
  $('#message').text('Retrieved forums successfully!')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
}

const getForumsFailure = function (error) {
  store.error = error
  $('#message').text('Error on retrieving forums!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
}

const getForumSuccess = function (data) {
  $('#message').text('Retrieved forum successfully!')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
}

const getForumFailure = function () {
  // store.error = error
  $('#message').text('Error on retrieving forum!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
}

const updateForumSuccess = function (data) {
  $('#update-forum-modal').modal('hide')
  $('#message').text('Updated forum successfully!')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(3000).slideToggle()
  $('#content').empty()
  return data
}

const updateForumFailure = function () {
  // console.log(error)
  $('#update-forum-modal').modal('hide')
  $('#message').text('Error on updating forum!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(3000).slideToggle()
}

const deleteForumSuccess = function (data) {
  $('#confirmDeleteForumModal').modal('hide')
  $('#message').text('Deleted forum successfully!')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(3000).slideToggle()
}

const deleteForumFailure = function () {
  // console.log(error)
  $('#confirmDeleteForumModal').modal('hide')
  $('#message').text('Error on deleting forum!')
  $('#message').removeClass('alert-success').addClass('alert-danger').show()
  $('form').find('input:not([type="submit"])').val('')
  $('#message').delay(3000).slideToggle()
}

const showForums = function (data) {
  console.log('data in showForums is ', data)
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
  $('#message').text('Retrieved forums successfully!')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('form').find('input:not([type="submit"])').val('')
  return data
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
  deleteForumSuccess,
  deleteForumFailure,
  showForums
}

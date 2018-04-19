const api = require('./forum-api.js')
const store = require('../store.js')
const showOneForumTemplate = require('../templates/forum.hbs')
const forumInfoTemplateWithButtons = require('../templates/forum-with-buttons.hbs')

let currentUser
let forumData

const getForum = function (data) {
  console.log('data is', data)
  api.getForum(data.id)
}

const getForumSuccess = function (data) {
  console.log('data in getForumSuccess is', data)
  const ownerOfViewedBlog = data.forum._owner
  currentUser = store.user.id
  if (ownerOfViewedBlog === currentUser) {
    forumData = forumInfoTemplateWithButtons({
      forum: data.forum.body,
      user: data.forum._owner})
  } else {
    forumData = showOneForumTemplate({
      forum: data.forum.body,
      user: data.forum._owner
    })
  }
  $('#message').text('forum loaded')
  $('#message').removeClass('alert-danger').addClass('alert-success').show()
  $('#message').delay(2000).slideToggle()
  $('#content').html(forumData)
  $('#forum-update-open-modal').on('click', () => {
    $('.update-forum-modal').modal('show')
  })
  // $('#update-forum-submit').on('submit', onUpdateForum)
}

module.exports = {
  getForum,
  getForumSuccess
}

const api = require('./forum-api')
const getFormFields = require('../../../lib/get-form-fields')
const ui = require('./forum-ui')

const onCreateForum = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  api.createForum(data)
    .then(ui.createForumSuccess)
    .catch(ui.createcreateForumFailure)
}

const onGetAllForums = function (event) {
  event.preventDefault()
  console.log('onGetAllForums was triggered')
  api.getForums()
    // .then(ui.getForumsSuccess)
    .then(ui.showForums)
    .catch(ui.getForumsFailure)
}

const onGetForum = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  const forum = data.forum
  // console.log(event)
  api.getForum(forum.id)
    .then(ui.getForumSuccess)
    .catch(ui.getForumFailure)
}

const onUpdateForum = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  api.updateForum(data)
    .then(() => ui.updateForumSuccess(data))
    .then((data) => api.getForum(data.forum.id))
    .catch(ui.updateForumFailure)
}

// const onBlogPostUpdate = function () {
//   event.preventDefault()
//   const data = getFormFields(event.target)
//   api.blogPostUpdate(data)
//     .then(() => ui.blogPostUpdateSuccess())
//     // .then(() => api.blogPostShow())
//     // .then(ui.blogPostShowSuccess)
//     .catch(ui.blogPostUpdateFailure)
// }

const onDeleteForum = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  const forum = data.forum
  api.deleteForum(forum.id)
    .then(ui.deleteForumSuccess)
    .catch(ui.deleteForumFailure)
}

const addHandlers = () => {
  $('#create-forum').on('submit', onCreateForum)
  $('#show-all-forums-button').on('click', onGetAllForums)
  $('#get-forum').on('submit', onGetForum)
  $('#update-forum').on('submit', onUpdateForum)
  $('#delete-forum').on('click', onDeleteForum)
}

module.exports = {
  addHandlers,
  onUpdateForum
}

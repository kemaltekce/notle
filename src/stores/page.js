import { readonly, reactive, ref } from "vue"
import _ from 'lodash'
import uuid from "../utils/uuid"
import bullet from "./bullet"


// state
const pages = reactive([
  {id: '22f2', title: 'daily log.'},
  {id: '33d2', title: 'weekly log.'},
  {id: '44d2', title: 'monthly log.'},
  {id: '55d2', title: 'archive.'},
  {id: '66d2', title: 'journal.'},
])

const currentPageID = ref(null)
// add state for main editing bullet id to get access to editModeBulletID inside
// the bullet component and the page view. Variable is mainly defined inside the bullet component.
// But it has to be deactivated and set to null inside the page view.
// Because the deactivatation is part of a event listener. Adding the event
// listener to the bullet component caused the problem of adding multiple
// listeners because the bullet component can be mounted multiple times to the
// dom.
const editModeBulletID = ref(null)

// actions
function getById(id) {
  return readonly(pages[pages.findIndex((x) => x.id === id)] || {})
}

function setCurruntPageID(id) {
  currentPageID.value = id
}

function move(from, to) {
  while (from < 0) {
    from += pages.length
  }
  while (to < 0) {
    to += pages.length
  }
  pages.splice(to, 0, pages.splice(from, 1)[0])
}

function add() {
  const newPage = {'id': uuid(), title: 'heyy.'}
  pages.push(newPage)
  bullet.addNewPage(newPage.id)
}

function remove(id) {
  const index = _.findIndex(pages, {'id': id})
  pages.splice(index, 1)
}

function updateTitle(id, newTitle) {
  const index = _.findIndex(pages, {'id': id})
  pages[index].title = newTitle
}

function setEditModeBulletID(id) {
  editModeBulletID.value = id
}

export default {
  all: readonly(pages),
  getById,
  currentPageID: readonly(currentPageID),
  setCurruntPageID,
  move,
  add,
  remove,
  updateTitle,
  editModeBulletID: readonly(editModeBulletID),
  setEditModeBulletID,
}

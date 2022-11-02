import { readonly, reactive, ref } from "vue"
import _, { upperCase } from 'lodash'
import uuid from "../utils/uuid"


// state
const page_bullets = reactive([
  {
    'page_id': '22f2',
    'bullets': [
      {
        id: 'asdf2',
        style: 'todo',
        text: "task oned",
        toggled: true,
        bullets: [
          {
            id: 'ddasdf2',
            style: 'note',
            text: "note one",
            toggled: false,
            bullets: []
          }
        ]
      },
      {
        id: 'asdf2334',
        style: 'todo',
        text: "task two",
        toggled: true,
        bullets: [
          {
            id: 'ddasdf2',
            style: 'note',
            text: "note two",
            toggled: false,
            bullets: []
          }
        ]
      },
      {
        id: 'asdffjfk2',
        style: 'text',
        text: "simple text",
        toggled: false,
        bullets: []
      }
    ]
  },
  {
    'page_id': '33d2',
    'bullets': [
      {
        id: 'asdf2mmkj',
        style: 'todo',
        text: "",
        toggled: false,
        bullets: []
      },
    ]
  },
  {
    'page_id': '44d2',
    'bullets': [
      {
        id: 'asdfff2mmkj',
        style: 'todo',
        text: "",
        toggled: false,
        bullets: []
      },
    ]
  },
  {
    'page_id': '55d2',
    'bullets': [
      {
        id: 'asd4df2mmkj',
        style: 'todo',
        text: "",
        toggled: false,
        bullets: []
      },
    ]
  },
  {
    'page_id': '66d2',
    'bullets': [
      {
        id: 'asdf89mmkj',
        style: 'todo',
        text: "",
        toggled: false,
        bullets: []
      },
    ]
  },
])

// actions
function getPageBullets(id) {
  const page = page_bullets[page_bullets.findIndex((x) => x.page_id === id)] || []
  return readonly(page.bullets)
}

function addNewPage(id) {
  console.log(id)
  const newPage = {
    'page_id': id,
    'bullets': [
      {
        id: uuid(),
        style: 'text',
        text: "",
        toggled: false,
        bullets: []
      }
    ]
  }
  page_bullets.push(newPage)
}

function updatePageBullets(update) {
  const index = _.findIndex(page_bullets, {'page_id': update.page_id})
  page_bullets.splice(index, 1)
  page_bullets.push({
      'page_id': update.page_id,
      'bullets': update.bullets
    })
}

export default {
  getPageBullets,
  addNewPage,
  updatePageBullets,
}

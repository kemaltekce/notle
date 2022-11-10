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
        text: "task one",
        toggled: true,
        bullets: [
          {
            id: 'ddasadsfdf2',
            style: 'note',
            text: "note one",
            toggled: false,
            bullets: []
          },
          {
            id: 'ddasdf294n',
            style: 'note',
            text: "note one two",
            toggled: true,
            bullets: [
              {
                id: 'ddasdfdmeme2',
                style: 'note',
                text: "note one two one",
                toggled: false,
                bullets: []
              }
            ]
          },
          {
            id: 'ddasdf03j3n2',
            style: 'note',
            text: "note one three",
            toggled: false,
            bullets: [
              {
                id: 'dfkmnddasdf2',
                style: 'note',
                text: "note one three one",
                toggled: false,
                bullets: []
              }
            ]
          }
        ]
      },
      {
        id: 'asdf2334',
        style: 'todo',
        text: "task two",
        toggled: false,
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
      },
      {
        id: 'asdffjfk2donutuzie',
        style: 'done',
        text: "done task",
        toggled: false,
        bullets: []
      },
      {
        id: 'asdffjfk2dqewrone',
        style: 'important',
        text: "important task",
        toggled: false,
        bullets: []
      },
      {
        id: 'asdffjfk2dfafbeone',
        style: 'migrate',
        text: "migrated task",
        toggled: false,
        bullets: []
      },
      {
        id: 'asdffjfk2dondfae',
        style: 'future',
        text: "future task",
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

function getBullet(pageID, bulletIDs) {
  // bulletIDs list of nested bullet ids leading to final bullet. step by step
  const index = _.findIndex(page_bullets, {'page_id': pageID})
  var data = page_bullets[index]
  for (const x of bulletIDs) {
    const index = _.findIndex(data.bullets, {'id': x})
    var data = data.bullets[index]
  }
  return data
}

function getBulletAndSiblings(pageID, bulletIDs) {
  // bulletIDs list of nested bullet ids leading to final bullet. step by step
  var index = _.findIndex(page_bullets, {'page_id': pageID})
  var data = page_bullets
  for (const x of bulletIDs) {
    data = data[index]
    index = _.findIndex(data.bullets, {'id': x})
    var data = data.bullets
  }
  return {bulletIndex: index, bullets: data}
}

function updateBulletText(pageID, bulletIDs, text) {
  const bullet = getBullet(pageID, bulletIDs)
  bullet.text = text
}

function changeBulletToggle(pageID, bulletIDs, toggled) {
  const bullet = getBullet(pageID, bulletIDs)
  bullet.toggled = toggled
}

function addNewBullet(pageID, bulletIDs) {
  const bullet = getBullet(pageID, bulletIDs)
  const newID = uuid()
  if (bullet.toggled) {
    bullet.bullets.splice(0, 0, {
      id: newID,
      style: bullet.style,
      text: "",
      toggled: false,
      bullets: []
    })
  } else {
    const bulletAndSiblings = getBulletAndSiblings(pageID, bulletIDs)
    bulletAndSiblings.bullets.splice(bulletAndSiblings.bulletIndex + 1, 0, {
      id: newID,
      style: bulletAndSiblings.bullets[bulletAndSiblings.bulletIndex].style,
      text: "",
      toggled: false,
      bullets: []
    })
  }
  return newID
}

export default {
  getPageBullets,
  addNewPage,
  updatePageBullets,
  updateBulletText,
  changeBulletToggle,
  addNewBullet,
}
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

function getBulletAndGrandparents(pageID, bulletIDs) {
  // bulletIDs list of nested bullet ids leading to final bullet. step by step
  // the last id is the edited bullet id
  const bulletID = bulletIDs.slice(-1)[0]
  // the second to last bullet id is the parent id of the edited bullet id
  const parentBulletID = bulletIDs.slice(-2, -1)[0]
  // remeining bullet ids are ids leading to the parent and edited bullet id
  const remainingBulletIDs = bulletIDs.slice(0, -2)

  var index = _.findIndex(page_bullets, {'page_id': pageID})
  var data = page_bullets[index]

  if (remainingBulletIDs.length > 0) {
    // iterate through remaining bullet ids until you reach the grandparent
    // bullet
    for (const x of remainingBulletIDs) {
      index = _.findIndex(data.bullets, {'id': x})
      data = data.bullets[index]
    }
  }
  const grandparent = data
  const parentIndex = _.findIndex(data.bullets, {'id': parentBulletID})
  const bulletIndex = _.findIndex(
    data.bullets[parentIndex].bullets, {'id': bulletID})

  return {
    bulletIndex: bulletIndex,
    parentIndex: parentIndex,
    grandparent: grandparent}
}

function updateBulletText(pageID, bulletIDs, text) {
  const bullet = getBullet(pageID, bulletIDs)
  // if bullet is deleted, blur is triggered. Blur also triggers the text update
  // but the bullet doesn't exist anymore. So only update the text if bullet
  // exists
  if (bullet) {
    bullet.text = text
  }
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

function indentBullet(pageID, bulletIDs) {
  const {bulletIndex, bullets} = getBulletAndSiblings(pageID, bulletIDs)
  const editedBullet = bullets[bulletIndex]
  // add bullet into toggle
  bullets[bulletIndex - 1].bullets.push(editedBullet)
  // activate toggle
  bullets[bulletIndex - 1].toggled = true
  // remove bullet from original place
  bullets.splice(bulletIndex, 1)
  return editedBullet.id
}

function unindentBullet(pageID, bulletIDs) {
  var {bulletIndex, parentIndex, grandparent} = getBulletAndGrandparents(pageID, bulletIDs)
  const editedBullet = grandparent.bullets[parentIndex].bullets[bulletIndex]
  // add bullet to parents from toggle
  grandparent.bullets.splice(parentIndex + 1, 0, editedBullet)
  // remove bullet form toggle
  grandparent.bullets[parentIndex].bullets.splice(bulletIndex, 1)
  // set toggle to false if parents bullets are empty
  if (grandparent.bullets[parentIndex].bullets.length === 0) {
    grandparent.bullets[parentIndex].toggled = false
  }
  return editedBullet.id
}

function removeStyle(pageID, bulletIDs, text) {
  const bullet = getBullet(pageID, bulletIDs)
  bullet.style = 'text'
  bullet.text = text
}

function remove(pageID, bulletIDs) {
  // get and return previous active bullet id so that we can set focus onto it
  // after removing the current bullet
  let previousBulletID = getPreviousActiveBullet(pageID, bulletIDs)

  // remove process
  var { bullet, bulletIndex, siblings, parent } = getBulletAndParent(pageID, bulletIDs)
  // before removing the bullet check if bullet has toggled bullets itself.
  // if so move the child bullets to the bullets siblings
  let index = 0
  for (const x of bullet.bullets) {
    index++
    siblings.splice(bulletIndex + index, 0, x)
  }
  // remove bullet
  siblings.splice(bulletIndex, 1)
  // if bullet is last bullet in toggle. set toggle to false
  if (parent.bullets.length === 0) {
    parent.toggled = false
  }

  return previousBulletID
}

function getBulletAndParent(pageID, bulletIDs) {
  var parent
  var siblings
  // bulletIDs list of nested bullet ids leading to final bullet. step by step
  var index = _.findIndex(page_bullets, {'page_id': pageID})
  var data = page_bullets[index]
  for (const x of bulletIDs) {
    index = _.findIndex(data.bullets, {'id': x})
    parent = data
    siblings = data.bullets
    var data = data.bullets[index]
  }
  return {bullet: data, bulletIndex: index, siblings: siblings, parent: parent}
}

function getPreviousActiveBullet(pageID, bulletIDs) {
  var { bullet, bulletIndex, siblings, parent } = getBulletAndParent(pageID, bulletIDs)
  // if bullet is first child bullet, focus back onto the parent bullet
  if (bulletIndex === 0) {
    // but if bullet is first bullet on page focus on title of page
    if (bulletIDs.length === 1) {
      return 'title'
    }
    return parent.id
  }
  // if bullet is not first, then it has siblings to focus on. Focus on the
  // previous bullet or onto its the last child if previous bullet has the
  // toggle activated
  let previousSibling = siblings[bulletIndex - 1]
  while (previousSibling.toggled) {
    previousSibling = previousSibling.bullets.at(-1)
  }
  return previousSibling.id
}

function getNextActiveBullet(pageID, bulletIDs) {
  var { bullet, bulletIndex, siblings, parent } = getBulletAndParent(
    pageID, bulletIDs)

  // if toggle active the next bullet is the bullet inside the toggle
  if (bullet.toggled) {
    return bullet.bullets[0].id
  }

  // at the end of page
  if ((bulletIDs.length === 1) && (parent.bullets.length === (bulletIndex + 1))) {
    return null
  }

  // if last bullet layer, the next bullet is the parents next sibling or even
  // further back the layers
  if ((bulletIndex + 1) === parent.bullets.length) {
    var {bulletIndex, parentIndex, grandparent} = getBulletAndGrandparents(
      pageID, bulletIDs)

    // end while loop if grandparent has a next parent bullet
    var remainingBulletIDs = bulletIDs
    while (grandparent.bullets.length < (parentIndex + 2)) {
      var remainingBulletIDs = remainingBulletIDs.slice(0, -1)
      // if nothing remains the nested toggled bullet is the last bullet.
      // and we are at the end of the page
      if (remainingBulletIDs.length === 1) {
        return null
      }
      var {bulletIndex, parentIndex, grandparent} = getBulletAndGrandparents(
        pageID, remainingBulletIDs)
    }
    return grandparent.bullets[parentIndex + 1].id
  }

  // default is to return the id of the next sibling
  const nextSibling = parent.bullets[bulletIndex + 1]
  return nextSibling.id
}

export default {
  getPageBullets,
  addNewPage,
  updatePageBullets,
  updateBulletText,
  changeBulletToggle,
  addNewBullet,
  indentBullet,
  unindentBullet,
  remove,
  removeStyle,
  getPreviousActiveBullet,
  getNextActiveBullet,
}

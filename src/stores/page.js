import { readonly, reactive } from "vue"


// state
const pages = reactive([
  {id: '22f2', title: 'daily log.'},
  {id: '33d2', title: 'weekly log.'}
])

// actions
function getById (id) {
  return readonly(pages[pages.findIndex((x) => x.id === id)] || {})
}

export default {
  all: readonly(pages),
  getById,
}

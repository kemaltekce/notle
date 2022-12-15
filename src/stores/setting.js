import { readonly, reactive, ref, computed } from "vue"


// setting options
const styleOptions = {
  'light': {
    titleFontWeight: 300,
    pageFontWeight: 200,
    letterSpacing: '0rem',
    textTransform: 'none',
  },
  'bold': {
    titleFontWeight: 900,
    pageFontWeight: 400,
    letterSpacing: '0.5rem',
    textTransform: 'uppercase',
  }
}

const colorOptions = {
  'grey': {mainColor: '#F7F7F7', secondColor: '#d1d1d180'},
  'green': {mainColor: '#C9D8D8', secondColor: '#aebcbc80'},
  'violet': {mainColor: '#E5D7FA', secondColor: '#b9acc980'},
}

const titleOptions = {
  'yes': {displayHeyyTitle: true},
  'no': {displayHeyyTitle: false},
}

const fontOptions = {
  'default': {fontFamily: 'Inter', fontSize: '16px'},
  'mono': {fontFamily: 'Roboto Mono', fontSize: '15.5px'},
}

const designOptions = {
  'simple': {design: 'simple'},
  'retro': {design: 'retro'},
  'card': {design: 'card'},
}


// state
const name = ref('')
const style = ref('light')
const color = ref('grey')
const title = ref('yes')
const font = ref('default')
const design = ref('simple')

let theme = computed(() => {
  return {
    ...styleOptions[style.value],
    ...colorOptions[color.value],
    ...titleOptions[title.value],
    ...fontOptions[font.value],
    ...designOptions[design.value],
    name: name.value,
  }
})

// actions
function getById(id) {
  return readonly(pages[pages.findIndex((x) => x.id === id)] || {})
}

function setName(newName) {
  name.value = newName
}

function setStyle(newStyle) {
  style.value = newStyle
}

function setColor(newColor) {
  color.value = newColor
}

function setTitle(newTitle) {
  title.value = newTitle
}

function setFont(newFont) {
  font.value = newFont
}

function setDesign(newDesign) {
  design.value = newDesign
}

export default {
  theme: readonly(theme),
  name: readonly(name),
  style: readonly(style),
  color: readonly(color),
  title: readonly(title),
  font: readonly(font),
  design: readonly(design),
  styleOptions: readonly(styleOptions),
  titleOptions: readonly(titleOptions),
  colorOptions: readonly(colorOptions),
  fontOptions: readonly(fontOptions),
  designOptions: readonly(designOptions),
  setColor,
  setName,
  setStyle,
  setTitle,
  setFont,
  setDesign,
}

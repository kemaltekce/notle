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
  'default': {fontFamily: 'Inter'},
  'mono': {fontFamily: 'Roboto Mono'},
}


// state
const name = ref('')
const style = ref('light')
const color = ref('grey')
const title = ref('yes')
const font = ref('default')

let theme = computed(() => {
  return {
    ...styleOptions[style.value],
    ...colorOptions[color.value],
    ...titleOptions[title.value],
    ...fontOptions[font.value],
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

export default {
  theme: readonly(theme),
  name: readonly(name),
  style: readonly(style),
  color: readonly(color),
  title: readonly(title),
  font: readonly(font),
  styleOptions: readonly(styleOptions),
  titleOptions: readonly(titleOptions),
  colorOptions: readonly(colorOptions),
  fontOptions: readonly(fontOptions),
  setColor,
  setName,
  setStyle,
  setTitle,
  setFont,
}

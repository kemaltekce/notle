function blur(element) {
  element.setAttribute("contenteditable", false)
  element.blur()
}

export default blur

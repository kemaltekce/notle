import setCaretToEnd from "./setCaretToEnd"


function focus(element, caret=true) {
  element.setAttribute("contenteditable", true)
  element.focus()
  // setCaretToEnd(element, element.innerText.length)
  if (caret) {
    setCaretToEnd(element)
  }
}

export default focus

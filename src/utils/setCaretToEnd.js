function setCaretToEnd(contentEditableElement, offset) {
  var range,selection;
  if(document.createRange) {
      range = document.createRange();
      if ((contentEditableElement.childNodes[0] === undefined) || (offset === undefined)) {
        // use this if bullet is empty. If bullet is empty childNotes do
        // not exist.
        range.selectNodeContents(contentEditableElement);
      } else if (offset > contentEditableElement.innerText.length) {
        range.setStart(contentEditableElement.childNodes[0], contentEditableElement.innerText.length)
      }else {
        range.setStart(contentEditableElement.childNodes[0], offset)
      }
      range.collapse(false);
      selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
  }
  else if(document.selection) {
      range = document.body.createTextRange();
      range.moveToElementText(contentEditableElement);
      range.collapse(false);
      range.select();
  }
}

export default setCaretToEnd

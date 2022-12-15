function setFont(fontFamily, fontSize) {
    document.documentElement.style.setProperty('font-family', fontFamily, 'important')
    document.documentElement.style.setProperty('font-size', fontSize)
  }

  export default setFont

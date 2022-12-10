function setFont(font) {
    console.log(font + ', sans-serif !important')
    document.documentElement.style.setProperty(
      'font-family', font, 'important')
  }

  export default setFont

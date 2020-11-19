const vscode = require('vscode')

/**
* 是否在pug模板之内
*/
function isInPugTemplate (document, position) {
  const text = document.getText()
  let tagName = 'template'
  // <template lang="pug"> 的各种变种
  let reg = new RegExp(`(<)(${tagName})` + '\\b(?=[^>]*lang=([\"|\'](pug|jade)[\"|\']))(?![^/>]*/>\\s*$)')
  const start = text.search(reg)
  const end = text.lastIndexOf(`</${tagName}>`)
  if (start === -1 || end === -1) {
    return false
  }
  const startLine = document.positionAt(start).line
  const endLine = document.positionAt(end).line
  return position.line > startLine && position.line < endLine
}

module.exports = {
  isInPugTemplate
}

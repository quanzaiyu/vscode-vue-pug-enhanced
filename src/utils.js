const { Range, Position, Selection } = require('vscode')
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

/**
 * This function is used to set the current document text
 * @param newText
 */
async function setText(newText) {
  const editor = vscode.window.activeTextEditor
  const doc = editor.document

  await editor.edit(builder => {
    let start, end

    // Format whole file or selected text
    if (editor.selection.isEmpty) {
      const lastLine = doc.lineAt(doc.lineCount - 1);
      start = new Position(0, 0);
      end = new Position(doc.lineCount - 1, lastLine.text.length);
    } else {
      start = editor.selection.start;
      end = editor.selection.end;
    }

    // replace text
    builder.replace(new Range(start, end), newText);

    // Select the whole json
    editor.selection = new Selection(start, end);
  });
};

// 替换template标签
// <template> => </template><template lang="pug">
async function modifyTemplateToPug() {
  const editor = vscode.window.activeTextEditor

  let text = editor.document.getText()
  let templateMatch = text.match(/\s*<template.*\s*/)

  if (!templateMatch) return

  let start = editor.document.positionAt(templateMatch.index)
  let end = editor.document.positionAt(templateMatch.index + templateMatch[0].length)

  let range = new vscode.Range(start, end)

  let replaceStr = `<template lang="pug">\r\n`

  await editor.edit(edit => {
    // 执行替换template标签
    edit.replace(range, replaceStr)
  }, { undoStopBefore: false, undoStopAfter: false })
}

// 替换template标签
// </template><template lang="pug"> => <template>
async function modifyTemplateToHtml() {
  const editor = vscode.window.activeTextEditor

  let text = editor.document.getText()

  let templateMatch = text.match(/\s*<template.*\s*/)

  if (!templateMatch) return

  let start = editor.document.positionAt(templateMatch.index)
  let end = editor.document.positionAt(templateMatch.index + templateMatch[0].length)

  let range = new Range(start, end)

  const replaceStr = `<template>\r\n`

  await editor.edit(edit => {
    // 执行替换template标签
    edit.replace(range, replaceStr)
  })
}

module.exports = {
  isInPugTemplate,
  setText,
  modifyTemplateToPug,
  modifyTemplateToHtml
}

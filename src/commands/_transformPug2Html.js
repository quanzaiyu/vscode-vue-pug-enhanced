const vscode = require('vscode')
const pug = require('pug')

const transformPug2Html = async () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const selections = editor.selections

  let fragments = await Promise.all(selections.map(async (selection) => {
    const htmlCode = editor.document.getText(selection)
    return new Promise((resolve, reject) => {
      if (!htmlCode || !htmlCode.length) return resolve(null)
      try {
        resolve(pug.render(htmlCode, {
          pretty: true
        }))
      }
      catch (error) { reject(error) }
    })
  }))

  // 替换template标签
  // </template><template lang="pug"> => <template>
  const text = editor.document.getText()
  const templateMatch = text.match(/\s*<template.*\s*/)

  if (!templateMatch) return

  const start = editor.document.positionAt(templateMatch.index)
  const end = editor.document.positionAt(templateMatch.index + templateMatch[0].length)

  let range = new vscode.Range(start, end)

  const replaceStr = `<template>\r\n`

  editor.edit(edit => {
    // 执行替换template标签
    edit.replace(range, replaceStr)

    fragments.forEach((fragment, i) => {
      if (!fragment || !fragment.length) return

      // 将html字符串模板中起始的换行符去掉
      if (fragment.substr(0, 1) === '\n') { // \n 为一个字符，而不是两个
        fragment = fragment.substring(1, fragment.length)
      }

      // Pug => HTML
      edit.replace(editor.selections[i], fragment)
    })
  })
}

module.exports = {
  transformPug2Html
}

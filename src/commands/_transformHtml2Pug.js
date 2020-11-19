const vscode = require('vscode')
const html2jade = require('html2jade')

const transformHtml2Pug = async () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const selections = editor.selections

  let fragments = await Promise.all(selections.map(async (selection) => {
    const htmlCode = editor.document.getText(selection);
    if (!htmlCode) return null

    let editorConfig = vscode.workspace.getConfiguration('vue-pug-enhanced')

    return new Promise((resolve, reject) => {
      // @ts-ignore
      html2jade.convertHtml(htmlCode, {
        tabs: editorConfig.useTab || !editor.options.insertSpaces,
        nspaces: editorConfig.tabSize || editor.options.tabSize,
        double: editorConfig.doubleQuotes,
        bodyless: true,
        fragment: true,
        noattrcomma: editorConfig.omitCommas,
        donotencode: true,
        noemptypipe: true
      }, (err, jade) => {
        if (err) reject(err)
        resolve(jade)
      })
    })
  }))

  // 替换template标签
  // <template> => </template><template lang="pug">
  const text = editor.document.getText()
  const templateMatch = text.match(/\s*<template.*\s*/)

  if (!templateMatch) return

  const start = editor.document.positionAt(templateMatch.index)
  const end = editor.document.positionAt(templateMatch.index + templateMatch[0].length)

  let range = new vscode.Range(start, end)

  const replaceStr = `<template lang="pug">\r\n`

  editor.edit(edit => {
    // 执行替换template标签
    edit.replace(range, replaceStr)

    fragments.forEach((fragment, i) => {
      if (!fragment) return

      // 将pug字符串模板中末尾的换行符去掉
      if (fragment.substr(-1, 1) === '\n') { // \n 为一个字符，而不是两个
        fragment = fragment.substring(0, fragment.length - 1)
      }

      // HTML => Pug
      edit.replace(editor.selections[i], fragment)
    })
  })
}

module.exports = {
  transformHtml2Pug
}

const vscode = require('vscode')
const html2jade = require('html2jade')
const { modifyTemplateToPug, setText } = require('../utils')
const { Selection, Position, window } = require('vscode')

const transformHtml2Pug = async () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const selections = editor.selections

  if (selections.length > 1) {
    window.showInformationMessage("Don't make more then one selection")
    return
  }

  let fragments = await Promise.all(selections.map(async (selection) => {
    const htmlCode = editor.document.getText(selection);
    if (!htmlCode) return null

    let editorConfig = vscode.workspace.getConfiguration('vscode-vue-pug-enhanced')

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

  if (!fragments[0]) {
    return
  }

  // 将pug字符串模板中末尾的换行符去掉
  if (fragments[0].substr(-1, 1) === '\n') { // \n 为一个字符，而不是两个
    fragments[0] = fragments[0].substring(0, fragments[0].length - 1)
  }

  // HTML => Pug
  await setText(fragments[0])

  // <template> => </template><template lang="pug">
  await modifyTemplateToPug()

  // 调整选择区域
  editor.selection = new Selection(
    new Position(editor.selection.start.line + 1, 0),
    editor.selection.end
  )
}

module.exports = {
  transformHtml2Pug
}

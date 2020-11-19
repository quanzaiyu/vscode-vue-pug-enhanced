const vscode = require('vscode')
const pugBeautify = require('pug-beautify')

const formatPug = async () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const document = editor.document
  if (!document || !['pug', 'jade'].includes(document.languageId.toLowerCase()))  return

  let text = document.getText()

  let editorConfig = vscode.workspace.getConfiguration('vue-pug-enhanced')
  let options = {
    omit_div: editorConfig.omitDiv,
    fill_tab: editorConfig.useTab || !editor.options.insertSpaces,
    tab_size: editorConfig.tabSize || editor.options.tabSize
  }

  try {
    let result = pugBeautify(text, options) || text
    let lastLine = document.lineAt(document.lineCount - 1)
    let start = new vscode.Position(0, 0)
    let end = new vscode.Position(document.lineCount - 1, lastLine.text.length)
    let range = new vscode.Range(start, end)

    let edit = new vscode.WorkspaceEdit()
    edit.replace(document.uri, range, result)

    vscode.workspace.applyEdit(edit)
  } catch (err) {
    vscode.window.showErrorMessage(err)
  }
}

module.exports = {
  formatPug
}

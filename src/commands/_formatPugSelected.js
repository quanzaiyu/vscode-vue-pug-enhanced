const vscode = require('vscode')
const pugBeautify = require('pug-beautify')

const formatPugSelected = async () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const document = editor.document
  const selection = editor.selection
  const text = document.getText(selection)

  let editorConfig = vscode.workspace.getConfiguration('vscode-vue-pug-enhanced')
  let options = {
    omit_div: editorConfig.omitDiv,
    fill_tab: editorConfig.fillTab || !editor.options.insertSpaces,
    tab_size: editorConfig.tabSize || editor.options.tabSize
  }

  try {
    let result = pugBeautify(text, options) || text
    editor.edit(builder => {
      builder.replace(selection, result)
    })
  } catch (err) {
    vscode.window.showErrorMessage(err)
  }
}

module.exports = {
  formatPugSelected
}

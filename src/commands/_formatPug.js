const vscode = require('vscode')
const pugBeautify = require('pug-beautify')
const { setText } = require('../utils')
const { Position, Selection } = require('vscode')

const formatPug = async () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const document = editor.document
  if (!document || !['pug', 'jade', 'vue'].includes(document.languageId.toLowerCase())) return

  // 获取文件内容
  let text = document.getText()

  // 获取选区中的文本
  if (!editor.selection.isEmpty) {
    text = document.getText(editor.selection)
  } else {
    if (document.languageId.toLowerCase() === 'vue') {
      // vue文件，选中模板中的内容
      let regStart = new RegExp('<template\\b(?=[^>]*lang=([\"|\'](pug|jade)[\"|\']))(?![^/>]*/>\\s*$)')
      let regEnd = new RegExp('</template>')

      let templateStartMatch = text.match(regStart)
      let templateEndMatch = text.match(regEnd)

      if (!templateStartMatch || !templateEndMatch) return

      let startPosition = editor.document.positionAt(templateStartMatch.index)
      let endPosition = editor.document.positionAt(templateEndMatch.index)

      const lastTemplateLine = editor.document.lineAt(endPosition.line - 1);
      let selection = new Selection(
        new Position(startPosition.line + 1, 0),
        new Position(endPosition.line - 1, lastTemplateLine.text.length - 1)
      )

      editor.selection = selection

      text = document.getText(selection)
    }
  }

  let editorConfig = vscode.workspace.getConfiguration('vscode-vue-pug-enhanced')
  let options = {
    omit_div: editorConfig.omitDiv,
    fill_tab: editorConfig.useTab || !editor.options.insertSpaces,
    tab_size: editorConfig.tabSize || editor.options.tabSize
  }

  try {
    let result = pugBeautify(text, options) || text

    setText(result)
  } catch (err) {
    vscode.window.showErrorMessage(err)
  }
}

module.exports = {
  formatPug
}

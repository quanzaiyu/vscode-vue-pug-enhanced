const pugBeautify = require('pug-beautify')
const { setText, getTemplateText, isLanguage } = require('../utils')
const { window, workspace } = require('vscode')

const formatPug = async () => {
  const editor = window.activeTextEditor
  if (!editor) return

  const document = editor.document
  if (!document || !isLanguage(['pug', 'jade', 'vue', 'nvue'])) return

  // 获取文件内容
  let text = document.getText()

  let selection = editor.selection

  // 获取选区中的文本
  if (!selection.isEmpty) {
    text = document.getText(editor.selection)
  } else {
    let res = getTemplateText({templateLang: "pug", shouldSelectContent: true})
    if (res) {
      text = res.text
    }
  }

  let editorConfig = workspace.getConfiguration('vscode-vue-pug-enhanced')
  let options = {
    omit_div: editorConfig.omitDiv,
    fill_tab: editorConfig.useTab || !editor.options.insertSpaces,
    tab_size: editorConfig.tabSize || editor.options.tabSize
  }

  try {
    let result = pugBeautify(text, options) || text
    setText(result)
  } catch (err) {
    window.showErrorMessage(err)
  }
}

module.exports = {
  formatPug
}

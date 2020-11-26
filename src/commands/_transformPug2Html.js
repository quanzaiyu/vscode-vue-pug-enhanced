const pug = require('pug')
const { modifyTemplateToHtml, setText, getTemplateText, isLanguage } = require('../utils')
const { window } = require('vscode')

export async function transformPug2Html() {
  const editor = window.activeTextEditor
  if (!editor) return

  const document = editor.document
  if (!document || !isLanguage(['pug', 'jade', 'vue', 'nvue'])) return

  // 获取文件内容
  let text = document.getText()

  let selection = editor.selection

  // 没有选区，则默认选中template中的内容
  if (!selection.isEmpty) {
    text = editor.document.getText(selection)
  } else {
    if (isLanguage(['vue', 'nvue'])) {
      let res = getTemplateText({templateLang: "pug", shouldSelectContent: true})
      if (res) {
        text = res.text
      }
    }
  }

  try {
    let result = pug.render(text, { pretty: true }) || text

    // 将html字符串模板中起始的换行符去掉
    if (result.substr(0, 1) === '\n') { // \n 为一个字符，而不是两个
      result = result.substring(1, result.length)
    }

    // Pug => HTML
    await setText(result)

    if (isLanguage(['vue', 'nvue'])) {
      // </template><template lang="pug"> => <template>
      await modifyTemplateToHtml()
    }
  } catch (err) {
    window.showErrorMessage(err)
  }
}

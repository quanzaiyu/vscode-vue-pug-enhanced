const html2jade = require('html2jade')
const { modifyTemplateToPug, setText, getTemplateText, isLanguage } = require('../utils')
const { Selection, Position, window, workspace } = require('vscode')

export async function transformHtml2Pug() {
  const editor = window.activeTextEditor
  if (!editor) return

  const document = editor.document
  if (!document || !isLanguage(['html', 'vue', 'nvue'])) return

  // 获取文件内容
  let text = document.getText()

  let selection = editor.selection

  // 没有选区，则默认选中template中的内容
  if (!selection.isEmpty) {
    text = editor.document.getText(selection)
  } else {
    if (isLanguage(['vue', 'nvue'])) {
      let res = getTemplateText({shouldSelectContent: true})
      if (res) {
        text = res.text
      }
    }
  }

  try {
    let editorConfig = workspace.getConfiguration('vscode-vue-pug-enhanced')
    let result = await new Promise((resolve, reject) => {
      // @ts-ignore
      html2jade.convertHtml(text, {
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

    // 将pug字符串模板中末尾的换行符去掉
    if (result.substr(-1, 1) === '\n') { // \n 为一个字符，而不是两个
      result = result.substring(0, result.length - 1)
    }

    // Pug => HTML
    await setText(result)

    if (isLanguage(['vue', 'nvue'])) {
      // </template><template lang="pug"> => <template>
      await modifyTemplateToPug()
    }

    // 调整选择区域
    editor.selection = new Selection(
      new Position(editor.selection.start.line + 1, 0),
      editor.selection.end
    )
  } catch (err) {
    window.showErrorMessage(err)
  }
}

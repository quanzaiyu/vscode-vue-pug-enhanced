const pug = require('pug')
const { modifyTemplateToHtml, setText } = require('../utils')
const { window } = require('vscode')

const transformPug2Html = async () => {
  const editor = window.activeTextEditor
  if (!editor) return

  const selections = editor.selections

  if (selections.length > 1) {
    window.showInformationMessage("Don't make more then one selection")
    return
  }

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

  if (!fragments[0]) {
    return
  }

  if (!fragments[0] || !fragments[0].length) return

  // 将html字符串模板中起始的换行符去掉
  if (fragments[0].substr(0, 1) === '\n') { // \n 为一个字符，而不是两个
    fragments[0] = fragments[0].substring(1, fragments[0].length)
  }

  // Pug => HTML
  await setText(fragments[0])

  // </template><template lang="pug"> => <template>
  await modifyTemplateToHtml()
}

module.exports = {
  transformPug2Html
}

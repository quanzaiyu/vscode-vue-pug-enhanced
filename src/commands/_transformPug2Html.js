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

  editor.edit(builder => {
    fragments.forEach((fragment, i) => {
      if (!fragment || !fragment.length) return
      builder.replace(editor.selections[i], fragment)
    })
  })
}

module.exports = {
  transformPug2Html
}

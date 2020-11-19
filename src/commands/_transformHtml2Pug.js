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

  editor.edit(builder => {
    fragments.forEach((fragment, i) => {
        if (!fragment) return;
        builder.replace(editor.selections[i], fragment);
    });
  });
};

module.exports = {
  transformHtml2Pug
}

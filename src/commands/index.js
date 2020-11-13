const vscode = require('vscode')
const html2jade = require('html2jade');
const pug = require('pug');

const transformHtml2Pug = async () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const selections = editor.selections

  let fragments = await Promise.all(selections.map(async (selection) => {
    const htmlCode = editor.document.getText(selection);
    if (!htmlCode) return null

    return new Promise((resolve, reject) => {
      // @ts-ignore
      html2jade.convertHtml(htmlCode, {
        tabs: false,
        nspaces: 2,
        double: true,
        bodyless: true,
        fragment: false,
        noattrcomma: true,
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
}

const transformPug2Html = async () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const selections = editor.selections

  let fragments = await Promise.all(selections.map(async (selection) => {
    const htmlCode = editor.document.getText(selection);
    return new Promise((resolve, reject) => {
      if (!htmlCode || !htmlCode.length) return resolve(null);
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
      if (!fragment || !fragment.length) return;
      builder.replace(editor.selections[i], fragment);
    });
  });

}

module.exports = function (context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.transformHtml2Pug', transformHtml2Pug))
  context.subscriptions.push(vscode.commands.registerCommand('extension.transformPug2Html', transformPug2Html))
}

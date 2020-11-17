const vscode = require('vscode')
const pug = require('pug');
const html2jade = require('html2jade');
const pugBeautify = require('pug-beautify');

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
      if (!fragment || !fragment.length) return
      builder.replace(editor.selections[i], fragment)
    })
  })
}

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
    let lastLine = document.lineAt(document.lineCount - 1);
    let start = new vscode.Position(0, 0);
    let end = new vscode.Position(document.lineCount - 1, lastLine.text.length);
    let range = new vscode.Range(start, end);

    let edit = new vscode.WorkspaceEdit();
    edit.replace(document.uri, range, result);

    vscode.workspace.applyEdit(edit);
  } catch (err) {
    vscode.window.showErrorMessage(err);
  }
}

const formatPugSelected = async () => {
  const editor = vscode.window.activeTextEditor
  if (!editor) return

  const document = editor.document
  const selection = editor.selection
  const text = document.getText(selection)

  let editorConfig = vscode.workspace.getConfiguration('vue-pug-enhanced.formatter-pug');
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
    vscode.window.showErrorMessage(err);
  }
}

module.exports = function (context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.transformHtml2Pug', transformHtml2Pug))
  context.subscriptions.push(vscode.commands.registerCommand('extension.transformPug2Html', transformPug2Html))
  context.subscriptions.push(vscode.commands.registerCommand('extension.formatPug', formatPug))
  context.subscriptions.push(vscode.commands.registerCommand('extension.formatPugSelected', formatPugSelected))
}

const vscode = require('vscode')

const { transformHtml2Pug } = require('./_transformHtml2Pug')
const { transformPug2Html } = require('./_transformPug2Html')
const { formatPug } = require('./_formatPug')

module.exports = function (context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-vue-pug-enhanced.transformHtml2Pug', transformHtml2Pug),
    vscode.commands.registerCommand('vscode-vue-pug-enhanced.transformPug2Html', transformPug2Html),
    vscode.commands.registerCommand('vscode-vue-pug-enhanced.formatPug', formatPug)
  )
}

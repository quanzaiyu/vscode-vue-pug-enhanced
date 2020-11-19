const vscode = require('vscode')

const { transformHtml2Pug } = require('./_transformHtml2Pug')
const { transformPug2Html } = require('./_transformPug2Html')
const { formatPug } = require('./_formatPug')
const { formatPugSelected } = require('./_formatPugSelected')

module.exports = function (context) {
  context.subscriptions.push(vscode.commands.registerCommand('extension.transformHtml2Pug', transformHtml2Pug))
  context.subscriptions.push(vscode.commands.registerCommand('extension.transformPug2Html', transformPug2Html))
  context.subscriptions.push(vscode.commands.registerCommand('extension.formatPug', formatPug))
  context.subscriptions.push(vscode.commands.registerCommand('extension.formatPugSelected', formatPugSelected))
}

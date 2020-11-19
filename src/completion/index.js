const vscode = require('vscode');
const { vueEventsCompletion } = require('./_vueEvents');

module.exports = function(context) {
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider("vue", vueEventsCompletion, '@'))
}

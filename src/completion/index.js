const vscode = require('vscode');
const { isInPugTemplate } = require('../utils.js')

module.exports = function(context) {
  context.subscriptions.push(vscode.languages.registerCompletionItemProvider("vue", {
      provideCompletionItems: (document, position, token, context) => {
        if (!isInPugTemplate(document, position)) return

        const start = new vscode.Position(position.line, 0);
        const range = new vscode.Range(start, position);
        const text = document.getText(range);

        // 只要当前光标前的字符为 '@' 就开始自动补全
        if(text.substr(-1,1) === '@') {
          let keys = [
            "abort",
            "blur",
            "canplay",
            "canplaythrough",
            "change",
            "click",
            "ontextmenu",
            "dblclick",
            "drag",
            "dragend",
            "dragenter",
            "dragleave",
            "dragover",
            "dragstart",
            "drop",
            "durationchange",
            "emptied",
            "ended",
            "error",
            "focus",
            "formchange",
            "forminput",
            "hover",
            "input",
            "invalid",
            "keydown",
            "keypress",
            "keyup",
            "load",
            "Loadeddata",
            "Loadedmetadata",
            "loadstart",
            "mousedown",
            "mouseenter",
            "mouseleave",
            "mousemove",
            "mouseout",
            "mouseover",
            "mouseup",
            "mousewheel",
            "pause",
            "play",
            "playing",
            "progress",
            "ratechange",
            "readystatechange",
            "reset",
            "resize",
            "scroll",
            "seeked",
            "seeking",
            "select",
            "show",
            "stalled",
            "submit",
            "suspend",
            "timeupdate",
            "volumechange",
            "waiting",
          ]

          return keys.map(dep => {
            return new vscode.CompletionItem(dep, vscode.CompletionItemKind.Field);
          })
        }
      },
      resolveCompletionItem: (item, token) => {
        return null;
      }
  }, '@'))
};

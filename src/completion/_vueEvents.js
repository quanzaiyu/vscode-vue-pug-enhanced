const vscode = require('vscode');
const { isInPugTemplate } = require('../utils');

const eventKeys = [
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

const vueEventsCompletion = {
  provideCompletionItems: (document, position, token, context) => {
    if (!isInPugTemplate(document, position)) return

    const start = new vscode.Position(position.line, 0)
    const range = new vscode.Range(start, position)
    const text = document.getText(range)

    // 只要当前光标前的字符为 '@' 就开始自动补全
    if(text.substr(-1,1) === '@') {
      return eventKeys.map(dep => {
        return new vscode.CompletionItem(dep, vscode.CompletionItemKind.Field)
      })
    }
  },
  resolveCompletionItem: (item, token) => {
    return null;
  }
}

module.exports = {
  vueEventsCompletion
}

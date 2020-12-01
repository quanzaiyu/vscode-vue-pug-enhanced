const { CompletionItem, SnippetString, CompletionItemKind, Position, Range } = require('vscode')
const { isInPugTemplate } = require('../utils')

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
  // Transition Apis
  "before-enter",
  "before-leave",
  "before-appear",
  "enter",
  "leave",
  "appear",
  "after-enter",
  "after-leave",
  "after-appear",
  "enter-cancelled",
  "leave-cancelled",
  "appear-cancelled",
]

const vueEventsCompletion = {
  provideCompletionItems: (document, position, token, context) => {
    if (!isInPugTemplate(position)) return

    const start = new Position(position.line, 0)
    const range = new Range(start, position)
    const text = document.getText(range)

    // 只要当前光标前的字符为 '@' 就开始自动补全
    if(text.substr(-1, 1) === '@') {
      return eventKeys.map(dep => {
        let item = new CompletionItem(dep, CompletionItemKind.Field)
        item.insertText = new SnippetString(`${dep}="$1"$0`)
        return item
      })
    }
  },
  resolveCompletionItem: (item, token) => {
    return item
  }
}

module.exports = {
  vueEventsCompletion
}

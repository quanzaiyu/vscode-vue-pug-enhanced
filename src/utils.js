const { Range, Position, Selection, window } = require('vscode')

/**
* 是否在pug模板之内
*/
export function isInPugTemplate (position) {
  const editor = window.activeTextEditor
  const document = editor.document
  let text = document.getText()

  let tagName = 'template'
  // <template lang="pug"> 的各种变种
  let reg = new RegExp(`(<)(${tagName})` + '\\b(?=[^>]*lang=([\"|\'](pug|jade)[\"|\']))(?![^/>]*/>\\s*$)')
  const start = text.search(reg)
  const end = text.lastIndexOf(`</${tagName}>`)
  if (start === -1 || end === -1) {
    return false
  }
  const startLine = document.positionAt(start).line
  const endLine = document.positionAt(end).line
  return position.line > startLine && position.line < endLine
}

/**
 * 设置文本内容
 * @param newText
 */
export async function setText(newText) {
  const editor = window.activeTextEditor
  const document = editor.document

  await editor.edit(builder => {
    let start, end

    if (editor.selection.isEmpty) {
      const lastLine = document.lineAt(document.lineCount - 1);
      start = new Position(0, 0);
      end = new Position(document.lineCount - 1, lastLine.text.length);
    } else {
      start = editor.selection.start;
      end = editor.selection.end;
    }

    builder.replace(new Range(start, end), newText);
    editor.selection = new Selection(start, end);
  });
};

// 替换template标签
// <template> => </template><template lang="pug">
export async function modifyTemplateToPug() {
  const editor = window.activeTextEditor
  const document = editor.document
  let text = document.getText()

  let templateMatch = text.match(/\s*<template.*\s*/)

  if (!templateMatch) return

  let start = document.positionAt(templateMatch.index)
  let end = document.positionAt(templateMatch.index + templateMatch[0].length)

  let range = new Range(start, end)

  let replaceStr = `<template lang="pug">\r\n`

  await editor.edit(edit => {
    // 执行替换template标签
    edit.replace(range, replaceStr)
  }, { undoStopBefore: false, undoStopAfter: false })
}

// 替换template标签
// </template><template lang="pug"> => <template>
export async function modifyTemplateToHtml() {
  const editor = window.activeTextEditor
  const document = editor.document
  let text = editor.document.getText()

  let templateMatch = text.match(/\s*<template.*\s*/)

  if (!templateMatch) return

  let start = document.positionAt(templateMatch.index)
  let end = document.positionAt(templateMatch.index + templateMatch[0].length)

  let range = new Range(start, end)

  const replaceStr = `<template>\r\n`

  await editor.edit(edit => {
    // 执行替换template标签
    edit.replace(range, replaceStr)
  })
}

// 获取template标签中的内容
export function getTemplateText({templateLang = "", shouldSelectContent = false}) {
  const editor = window.activeTextEditor
  const document = editor.document

  if (document.languageId.toLowerCase() === 'vue') {
    // 获取文件内容
    let text = document.getText()

    // vue文件，选中模板中的内容
    let regStart = new RegExp('<template\\s*>\\s*')
    if (templateLang) {
      regStart = new RegExp('<template\\b(?=[^>]*lang=([\"|\'](' + templateLang +')[\"|\']))(?![^/>]*/>\\s*$)')
    }
    let regEnd = new RegExp('</template>')

    let templateStartMatch = text.match(regStart)
    let templateEndMatch = text.match(regEnd)

    if (!templateStartMatch || !templateEndMatch) return null

    let startPosition = document.positionAt(templateStartMatch.index)
    let endPosition = document.positionAt(templateEndMatch.index)

    const lastTemplateLine = document.lineAt(endPosition.line - 1);
    let selection = new Selection(
      new Position(startPosition.line + 1, 0),
      new Position(lastTemplateLine.lineNumber, lastTemplateLine.text.length)
    )

    if (shouldSelectContent) {
      editor.selection = selection
    }

    text = document.getText(selection)

    return { selection, text }
  } else {
    return null
  }
}

// 判断当前激活的文档类型
export function isLanguage(language) {
  return language.includes(window.activeTextEditor.document.languageId.toLowerCase())
}

const vscode = require('vscode');
const pug = require('pug');
function transform (htmlCode, config) {
    return new Promise((resolve, reject) => {
        if (!htmlCode || !htmlCode.length) return resolve(null);
        try { 
            resolve(pug.render(htmlCode,{pretty:true}));
         }
        catch (error) { reject(error); }
    })
}

function transformSelections(editor) {
    let selections = editor.selections;
    const config = {
        tabs: !editor.options.insertSpaces,
        fragment: true
    };
    return selections.map((selection) => {
        const htmlCode = editor.document.getText(selection);
        return transform(htmlCode, config);
    });
}

function replaceSelections(editor, fragments) {
    editor.edit(builder => {
        fragments.forEach((fragment, i) => {
            if (!fragment || !fragment.length) return;
            builder.replace(editor.selections[i], fragment);
        });
    });
}

module.exports = () => {
    let editor = vscode.window.activeTextEditor;
    if (!editor) return;

    Promise
        .all(transformSelections(editor))
        .then((fragments) => replaceSelections(editor, fragments))
        .catch((err) => {
            console.error(err);
        });
}

const vscode = require('vscode');
var html2jade = require('html2jade');

function transform (htmlCode, config) {
    return new Promise((resolve, reject) => {
        if (!htmlCode || !htmlCode.length) return resolve(null);
        try { 
            html2jade.convertHtml(htmlCode,{donotencode:true,bodyless:true,noemptypipe:true},function(e,jade){
                resolve(jade)
            })
         }
        catch (error) { reject(error); }
    })
}

function transformSelections(editor) {
    let selections = editor.selections;
    const config = {
        tabs: false,
        fragment: false
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

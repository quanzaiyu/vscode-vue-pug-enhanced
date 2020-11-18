# Vue Pug Enhanced

[![The MIT License](https://img.shields.io/badge/license-MIT-orange.svg?style=flat-square)](http://opensource.org/licenses/MIT)

<div align="center">
<img src="./images/icon.png" width='200'/>
</div>

## Features

- Code snippets for .vue files with pug template.
- Transform html to pug or pug to html.
- Format pug document or format pug selection.
- Autocomplete.

## Supported languages

- Pug
- Jade
- Vue

## Usage

### **Transform**

1. Create a selection.
2. Press `F1` or `Ctrl + Shift + P`.
3. Run the command named `Html to Pug` or `Pug to Html` to transform.

![Html to Pug](./doc/images/011.gif)

![Pug to Html](./doc/images/012.gif)

**commands**:

- Vue Pug Enhanced: Html to Pug
- Vue Pug Enhanced: Pug to Html

### **Format Pug Document**

1. Open a pug/jade file.
2. Press `Ctrl + Shift + P`
3. Enter `Format Pug`

![](./doc/images/008.gif)

**commands**:

- Vue Pug Enhanced: Format Pug

> Note: this command only support pug/jade file.

### **Format Pug Selection**

1. Create a selection.
2. Press `F1` or `Ctrl + Shift + P`.
3. Run the command named `Format Pug Selected`.

![](./doc/images/009.gif)

- Vue Pug Enhanced: Format Pug Selected

> Note: this command support every file.

In vue file:

![](./doc/images/010.gif)

### **Autocomplete**

> Vue Events

![](./doc/images/014.gif)

### **Code Snippets**

> v-for

![](./doc/images/002.gif)

> v-if

![](./doc/images/013.gif)

> Create Elements

![](./doc/images/004.gif)

![](./doc/images/005.gif)

![](./doc/images/007.gif)

## Supported settings

### vue-pug-enhanced.useTab

```
Type: Boolean
Default: false
Description: Indent with Tabs, if false, with spaces.
```

### vue-pug-enhanced.tabSize

```
Type: Number
Default: 2
Description: The number of spaces to indent generated files with. Default is 2 spaces. When `fillTab` is false, fill `tabSize` spaces.
```

### vue-pug-enhanced.doubleQuotes

```
Type: Boolean
Default: true
Description: Use double quotes for attributes.
```

### vue-pug-enhanced.omitDiv

```
Type: Boolean
Default: false
Description: Omit div tag when it has id or class.
```

### vue-pug-enhanced.omitCommas

```
Type: Boolean
Default: true
Description: Omit attribute separating commas.
```

## Release Notes

### 1.0.0

- Initial Extension
- Add command: Html to Pug
- Add command: Pug to Html
- Add snippets

### 1.0.2

- Add command: Format Pug
- Add command: Format Pug Selected

### 1.0.3

- Expose some settings

### 1.1.0

- Autocomplete vue events

## Based On

- [vetur](https://github.com/vuejs/vetur)
- [pug](https://github.com/pugjs/pug)
- [html2pug](https://github.com/izolate/html2pug)
- [html2jade](https://github.com/donpark/html2jade)
- [pug-beautify](https://github.com/vingorius/pug-beautify)

## References

- [formatter-pug](https://marketplace.visualstudio.com/items?itemName=alexbabichev.formatter-pug)
- [vscode-html-pug-convertor](https://marketplace.visualstudio.com/items?itemName=waynehong.vscode-html-pug-convertor)
- [vue-pug-snippets](https://marketplace.visualstudio.com/items?itemName=kaangokdemir.vue-pug-snippets)
- [vscode-jade-snippets](https://marketplace.visualstudio.com/items?itemName=mrmlnc.vscode-jade-snippets)
- [vscode-angular-pug](https://github.com/ghaschel/vscode-angular-pug)

**Enjoy!**

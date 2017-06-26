# 安装

## 体验 Marko

如果你只是想在浏览器中体验 Marko，你可以直接尝试我们的 [在线工具](https://markojs.com/try-online), 你将可以直接在浏览器中开发一个Marko应用程序。

## 创建新应用

如果你是一切从零开始, [`marko-devtools`](https://www.npmjs.com/package/marko-devtools) 提供了一个让你快速投入应用开发的启动程序，快来试试吧：

```bash
npm install marko-devtools --global
marko create hello-world
cd hello-world
npm install # or yarn
npm start
```

## 直接使用

### 安装

Marko 编译器运行在 [Node.js](https://nodejs.org/) 环境下，能通过 [npm](https://www.npmjs.com/package/marko/tutorial) 来进行安装:

```
npm install marko --save
```

或者，你也可以使用 [yarn](https://yarnpkg.com):

```
yarn add marko
```

### 浏览器端

假设我们有这样一个简单的视图想要在浏览器中呈现:

_hello.marko_
```marko
<h1>Hello ${input.name}</h1>
```

首先，创建一个依赖于该视图的 `client.js` 文件， 并指定该视图渲染至body：

_client.js_
```js
var helloComponent = require('./hello');

helloComponent.renderSync({ name:'Marko' })
    .appendTo(document.body);
```

我们还要创建一个简单的HTML页面来放置我们的应用：

_index.html_
```
<!doctype html>
<html>
<head>
    <title>Marko Example</title>
</head>
<body>

</body>
</html>
```

现在，我们需要将这些文件打包成一个`bundle`，以便于在浏览器中使用，我们可以使用 [`lasso`](https://github.com/lasso-js/lasso) 来帮我们完成这件事。因此，让我们（以`marko`插件）来安装它：

```
npm install --global lasso-cli
npm install --save lasso-marko
```

现在，我们可以为浏览器构建我们的`bundle`：

```
lasso --main client.js --plugins lasso-marko --inject-into index.html
```

上述指令，将会在一个新创建的 `static/` 目录中生成一个 `client.js` 文件，并且将在浏览器中加载我们的应用所需要的 `<script>` 标签注入到 HTML 中 。如果我们在 `view` 中也书写了 CSS，`<link>`标签也将同样会被自动注入。

在浏览器中加载这个页面，你将会看到 `Hello Marko` 静静地凝视着你。 

### 服务端

#### Require Marko views

Marko 提供了一个定制的`Node.js require extension`，这让你完全可以像标准的 JavaScript 模块一样来 `require` marko 文件，请看下面的示例 `server.js`:

_hello.marko_
```marko
<div>
    Hello ${input.name}!
</div>
```

_server.js_
```js
// 这一行引入了 Node.js 直接 require `*.marko` 文件的依赖。
// 它应该尽可能早地引入到你的应用中，在你 require 任何 `*.marko` 文件之前
require('marko/node-require');

var fs = require('fs');

// 直接通过 require 来加载一个 `*.marko` 文件（iew）:
var hello = require('./hello');
var out = fs.createWriteStream('hello.html', { encoding: 'utf8' });
hello.render({ name: 'Frank' }, out);
```

使用`Node.js require extension`完全是可选的，如果你不太喜欢这种使用方式，你也可以使用 [Marko DevTools](https://github.com/marko-js/marko-devtools) 来预编译所有的 marko 模板：

```bash
marko compile hello.marko
```

这将会在原始模板的旁边生成一个 `hello.marko.js` 文件，生成的 `.js` 文件将会在 Node.js 运行时被加载。重要的是，在 `require` 一个 `marko` 模板时要保持 `.marko` 拓展名，只有这样，这些`js`文件才会被正确地解析。

如果您只想在开发中使用`require extension`，你可以有条件地加载它。

```js
if (!process.env.NODE_ENV) {
    require('marko/node-require');
}
```

#### 托管一个简单的页面

让我们更改 `server.js` 文件以将视图托管在一个 `http` 服务器上

_server.js_
```js
// Allow requiring `.marko` files
require('marko/node-require');

var http = require('http');
var hello = require('./hello');
var port = 8080;

http.createServer((req, res) => {
    // let the browser know html is coming
    res.setHeader('content-type', 'text/html');

    // render the output to the `res` output stream
    hello.render({ name:'Marko' }, res);
}).listen(port);
```

并给 `hello.marko`增加一些内容:

_hello.marko_
```marko
<h1>Hello ${input.name}</h1>
```

启动服务器 (`node server.js`) ，并在浏览器中打开 [http://localhost:8080](http://localhost:8080)，你将会看到 `Hello Marko` 标题.

#### 初始化服务端渲染的组件

Marko会在关闭`</ body>`标签之前自动注入需要安装在浏览器中的组件列表（因此，你需要在渲染的输出中包含一个`<body>`）。

但是，您仍然需要将你页面中 CSS 和 JavaScript bundle在一起，并包含正确的`link`、`style`和`script`标签。 幸运的是，`lasso`的`taglib`将为您做所有的重大工作。

首先安装`lasso`和`lasso-marko`：

```
npm install --save lasso lasso-marko
```

接下来，在你的页面或布局视图中，添加 `lasso-head` 和 `lasso-body` 标签：


_layout.marko_
```marko
<!doctype>
<html>
<head>
    <title>Hello world</title>
    <lasso-head/>
</head>
<body>
    <include(input.body)/>
    <lasso-body/>
</body>
</html>
```

最后，给服务器增加配置—— `lasso` 生成的静态文件：

_server.js_
```js
app.use(require('lasso/middleware').serveStatic());
```

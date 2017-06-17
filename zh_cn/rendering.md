# 渲染

要渲染Marko视图, 你需要首先加载它：

_example.js_
```js
var fancyButton = require('./components/fancy-button');
```

> **Note:** 如果你在node.js环境中，你需要启用 [require extension](./installing.md#require-marko-views) 以便于直接require `.marko` 文件，或者，你也可以使用 [Marko DevTools](https://github.com/marko-js/marko-devtools) 来预编译所有的marko模板.  如果你是在浏览器端, 你将需要一个打包工具，比如 [`lasso`](./lasso.md), [`webpack`](./webpack.md), [`browserify`](./browserify.md) 或者 [`rollup`](./rollup.md).

一旦你有了视图，你可以传入数据并渲染它：

_example.js_
```js
var button = require('./components/fancy-button');
var html = button.renderToString({ label:'Click me!' });

console.log(html);
```

输入数据在视图中作为`input`生效，所以如果`fancy-button.marko`看起来像这样：

_./components/fancy-button.marko_
```marko
<button>${input.label}</button>
```

输出的HTML将是：

```html
<button>Click me!</button>
```

## 渲染方法

上面，我们使用了`renderToString`方法来渲染视图，但是实际上，有许多不同的方法可以用来渲染视图。

这些方法大多数会返回一个[`RenderResult`](＃renderresult)，它是一个使用辅助方法( helper methods)来处理渲染输出的对象。

### `renderSync(input)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `input` | `Object` | 用于渲染视图的输入数据 |
| 返回值 | [`RenderResult`](#renderresult) | 渲染的结果 |

使用 `renderSync` 可以强制渲染过程以同步结束。如果某个签尝试异步运行，则会抛出错误。

```js
var view = require('./view'); // Import `./view.marko`
var result = view.renderSync({});

result.appendTo(document.body);
```

### `render(input)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `input` | `Object` | 用于渲染视图的输入数据 |
| 返回值 | `AsyncStream`/`AsyncVDOMBuilder` | 异步 `out` 的渲染目标  |


`render` 方法会返回一个异步的`out`，用于在服务器上生成 `HTML`或在浏览器中生成一个虚拟DOM。在这两种情况下，异步`out`都有一个遵循`Promises / A +`规范的`then`方法，因此它可以像`Promise`一样被使用。这个`Promise` resolve了一个[`RenderResult`](#renderresult)。

```js
var view = require('./view'); // Import `./view.marko`
var resultPromise = view.render({});

resultPromise.then((result) => {
    result.appendTo(document.body);
});
```

### `render(input, callback)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `input` | `Object` | 用于渲染视图的输入数据 |
| `callback` | `Function` | 渲染结束时的回调函数 |
| 回调值 | [`RenderResult`](#renderresult) | 渲染的结果 |
| 返回值 | `AsyncStream`/`AsyncVDOMBuilder` | 异步 `out` 的渲染目标 |

```js
var view = require('./view'); // Import `./view.marko`

view.render({}, (err, result) => {
    result.appendTo(document.body);
});
```

### `render(input, stream)`

|  参数 | 类型 | 描述 |
| ------- | ---- | ----------- |
| `input` | `Object` | 用于渲染视图的输入数据 |
| `stream` | `WritableStream` | 一个可写的流 |
| 返回值 | `AsyncStream`/`AsyncVDOMBuilder` | 异步 `out` 的渲染目标 |

HTML输出通过 `stream` 写入并进行传递。

```js
var http = require('http');
var view = require('./view'); // Import `./view.marko`

http.createServer((req, res) => {
    res.setHeader('content-type', 'text/html');
    view.render({}, res);
});
```

### `render(input, out)`

|  参数 | 类型 | 描述 |
| ------- | ---- | ----------- |
| `input` | `Object` | 用于渲染视图的输入数据 |
| `out` | `AsyncStream`/`AsyncVDOMBuilder` | The async `out` to render to |
| 返回值 | `AsyncStream`/`AsyncVDOMBuilder` | 被传出的 `out` |

`render` 方法也允许传递一个现有的异步 `out`。如果这样做，`render` 不会自动结束异步 `out`（这允许你在另一个视图的中间渲染另一个视图）。如果异步 `out` 不会以其他方式结束，那么您需要手动结束。

```js
var view = require('./view'); // Import `./view.marko`
var out = view.createOut();

view.render({}, out);

out.on('finish', () => {
    console.log(out.getOutput());
});

out.end();
```


### `renderToString(input)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `input` | `Object` | 用于渲染视图的输入数据 |
| 返回值 | `String` | The HTML string produced by the render |

返回 HTML String 并强制渲染完成同步。如果标签尝试异步运行，则会抛出错误。

```js
var view = require('./view'); // Import `./view.marko`
var html = view.renderToString({});

document.body.innerHTML = html;
```

### `renderToString(input, callback)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `input` | `Object` | 用于渲染视图的输入数据 |
| callback value | `String` | The HTML string produced by the render |
| return value | `undefined` | N/A |

HTML string 将会通过回调进行传递

```js
var view = require('./view'); // Import `./view.marko`

view.renderToString({}, (err, html) => {
    document.body.innerHTML = html;
});
```

### `stream(input)`

`stream` 方法返回输出 HTML 的 node.js 流，此方法在服务端可用，但在浏览器中默认情况下不可用。如果您想在浏览器中使用流，你需要 `require('marko/stream')` 作为客户端 bundle 的一部分。

```js
var fs = require('fs');
var view = require('./view'); // Import `./view.marko`
var writeStream = fs.createWriteStream('output.html');

view.stream({}).pipe(writeStream);
```

## 渲染结果

### `getComponent()`
### `getComponents(selector)`
### `afterInsert(doc)`
### `getNode(doc)`
### `getOutput()`
### `appendTo(targetEl)`
### `insertAfter(targetEl)`
### `insertBefore(targetEl)`
### `prependTo(targetEl)`
### `replace(targetEl)`
### `replaceChildrenOf(targetEl)`

## 全局数据

如果您需要让数据在全局空间对所有通过调用上述渲染方法之一而呈现的视图有效，你可以将数据作为 `input` 数据对象上的 `$global` 属性传递。这些数据将会从`input` 中删除，并合并到 `out.global` 属性中。

```js
view.render({
    $global: {
        flags: ['mobile']
    }
});
```

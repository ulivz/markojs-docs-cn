# 服务端渲染

Marko允许任何 Marko模板/UI组件在服务器或浏览器渲染。一个页面可以被渲染为一个`可写`流，如HTTP响应流，如下所示:

```js
var template = require('./template'); // Import ./template.marko

module.exports = function(req, res) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    template.render({ name: 'Frank' }, res);
};
```

Marko还为你提供了`可读`流。

```js
var template = require('./template'); // Import ./template.marko

module.exports = function(req) {
    // Return a Readable stream for someone to do something with:
    return template.stream({ name: 'Frank' });
};
```

> **ProTip:** Marko还实现了对一些服务端框架的集成：
> - [express](/docs/express)
> - [hapi](/docs/hapi)
> - [koa](/docs/koa)
> - [huncwot](/docs/huncwot)

## UI 引导

当页面呈现在服务器上时，会在输出的HTML中添加其他代码，以便UI能够在浏览器中立即启动。此附加代码允许在服务器上呈现的UI组件自动插入到浏览器中。对于每个 _顶层_ 的UI组件，Marko将序列化组件的数据（包括`input`和`state`以及添加到UI组件实例中的任何属性），以便每个顶层UI组件可以在浏览器加载页面时被重新渲染和挂载。对于每个顶级UI组件只会进行`部分`的重新渲染。也就是说，当在浏览器中进行部分重新渲染时，DOM不会更新，并且实际上没有生成虚拟DOM。

Marko将所需的信息编码为渲染出的HTML元素的属性，同时还生成将挂载UI组件的`<script>`标签。 `<script>`中的代码会简单地注册UI组件，当`Marko runtime`最终加载结束时，所有注册的UI组件将会被挂载。这样可以允许随时加载Marko runtime，而不会导致JavaScript错误。

## 引导组件

当服务端渲染的页面在浏览器中加载时，marko可以自动检测在服务器上渲染的UI组件，并在浏览器中使用正确的`state`和`input`创建并挂载它们。

### 引导: Lasso

如果你使用[Lasso.js](https://github.com/lasso-js/lasso)，那么引导将会自动发生，只要页面的JavaScript包通过 `<lasso-body>` 标签包含。 典型的HTML页面结构将如下所示：


_routes/index/template.marko_

```marko
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Marko + Lasso</title>

        <!-- CSS includes -->
        <lasso-head/>
    </head>
    <body>
        <!-- Top-level UI component: -->
        <app/>

        <!-- JS includes -->
        <lasso-body/>
    </body>
</html>
```

> **ProTip:** 我们提供了一些示例应用程序，以帮助你开始使用Marko + Lasso
> - [marko-lasso](https://github.com/marko-js-samples/marko-lasso)
> - [ui-components-playground](https://github.com/marko-js-samples/ui-components-playground)


### 引导: Non-Lasso

如果正在使用Lasso以外的JavaScript模块加载器，那么你需要添加一些客户端代码，执行以下操作，以在浏览器中安装你的应用：

1. Load/import/require 所有在服务器上渲染的所有UI组件（加载顶层UI组件通常已经足够了）
2. 调用 `require('marko/components').init()`

例如，如果 `client.js` 是客户端应用程序的入口：

_routes/index/client.js_
```js
// 加载顶层UI组件:
require('./components/app/index');

// 现在，UI组件的所有JavaScript模块已经加载和注册
// 我们可以告诉marko来引导/初始化应用程序

// 初始化并挂载所有服务器渲染的UI组件：:
require('marko/components').init();
```

> **ProTip:** 我们提供了一些示例应用程序来帮助你快速开始一个marko应用：
> - [marko-webpack](https://github.com/marko-js-samples/marko-webpack)
> - [marko-browserify](https://github.com/marko-js-samples/marko-browserify)
> - [marko-rollup](https://github.com/marko-js-samples/marko-rollup)

# 序列化

对于每个顶层的UI组件，Marko将序列化组件中的数据（包括`input`和`state`以及添加到UI组件实例的任何属性）到浏览器。你可以通过实现[`toJSON`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify)来控制那些数据被序列化，或者通过重新分配 `this.input` ，在UI组件的 `onInput(input, out)` 生命周期方法中，如下所示：

```javascript
class {
    onInput() {
        // 不要序列化任何输入：
        this.input = null;

        // 序列化一个新对象，而不是提供输入：
        this.input = {
            foo: 'bar'
        };
    }
}
```

> NOTE: Marko允许序列化对象中的循环，但重复的对象只能被序列化一次

# 注意事项

在服务器渲染一个页面有一些注意事项：

- 顶级UI组件的UI组件数据必须可序列化：
     - 只有简单的对象，数字，字符串，布尔值，数组和`Date`对象是可序列化的
     - 函数不能被序列化
- 应注意避免让Marko序列化太多的数据
- 默认情况下，`out.global`中的数据都不会被序列化，但是可以做如下更改


## 序列化全局变量

如果`out.global`对象上有特定的属性需要被序列化，那么当顶层页面在服务器上渲染时，它们必须被列入白名单。例如，要使`out.global.apiKey`和`out.global.locale`属性被序列化，你需要执行以下操作：

```js
template.render({
        $global: {
            serializedGlobals: {
                apiKey: true,
                locale: true
            }
        }
    }, res);
```

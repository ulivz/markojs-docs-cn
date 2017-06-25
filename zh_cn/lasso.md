# Marko + Lasso

 [Lasso.js](https://github.com/lasso-js/lasso) 的 [lasso-marko](https://github.com/lasso-js/lasso-marko) 插件在打包时会自动编译所有导入的Marko模板。此外，`lasso-marko`插件也会自动打包任何模板的依赖项（包括依赖的CSS）。

Lasso.js提供了一些Marko自定义标签，用于注入JavaScript和CSS，图片以及其他资源。

 [marko-lasso](https://github.com/marko-js-samples/marko-lasso) 演示了如何使用Marko和Lasso构建一个可靠的Web应用程序。
 
## 安装

```
npm install lasso-marko --save
```

## 注册组件

```js
require('lasso').configure({
    "plugins": [
        ...
        "lasso-marko"
    ]
    ...
});
```

## Lasso自定义标签

要将所需的JavaScript和CSS注入到页面中，你需要使用`<lasso-page>`，`<lasso-head>`和`<lasso-body>`标签。

```html
<lasso-page package-path="./browser.json" />

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Marko + Lasso</title>
        <lasso-head/>
    </head>
    <body>
        <lasso-body/>
    </body>
</html>
```

`browser.json`提供了一种简单的方法来声明 _顶层_ 页面依赖关系。例如：

_browser.json_
```json
{
    "dependencies": [
        "./style.css",
        "require-run: ./client.js"
    ]
}
```

Lasso.js将通过构建和遍历依赖关系图来自动打包依赖。

## 客户端渲染

Marko模板可以被任何JavaScript模块导入和渲染，下面的代码显示了如何渲染顶级UI组件，并将其作为一个`document.body`的后代挂载到DOM中：

_client.js_
```js
require('./components/app/index.marko')
    .renderSync({})
    .appendTo(document.body);
```

当Lasso.js打包上面的代码时，它将自动打包所需的`./components/app/index.marko` 文件。

## 服务端渲染

如果你在服务器上渲染初始化的UI，则需要确保将所有UI组件打包并发送到浏览器，以便可以在浏览器中挂载UI组件。例如：

_about-me/index.marko_
```marko
<lasso-page package-path="./browser.json" />

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Marko + Lasso</title>

        <!-- CSS will be inserted here -->
        <lasso-head/>
    </head>
    <body>
        <!-- Top-level UI component: -->
        <app/>

        <!-- JS will be inserted here -->
        <lasso-body/>
    </body>
</html>
```

通常，将顶层的UI组件添加页面的依赖中是必需的：

_about-me/browser.json_
```json
{
    "dependencies": [
        "./style.css",
        "require: ./components/app/index.marko"
    ]
}
```

## 浏览器刷新

推荐使用[browser-refresh]（https://github.com/patrick-steele-idem/browser-refresh）进行即时页面刷新和热重新加载Marko模板，样式和其他资源。 `browser-refresh`与Lasso和Marko很好的配合使用，可以作为`node`的替代品。

```bash
browser-refresh server.js
```

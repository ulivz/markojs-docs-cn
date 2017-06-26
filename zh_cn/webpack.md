# Marko + Webpack

针对 [Webpack](https://webpack.github.io/) 的 [marko-loader](https://github.com/marko-js/marko-loader) 会在在打包时会自动编译所有导入的Marko模板。此外，`marko-loader` 也会自动打包任何模板的依赖项（包括依赖的CSS）。

> **ProTip**: 想实际动手来看看? 请查看 [`marko-webpack`](https://github.com/marko-js-samples/marko-webpack)。
## 安装

```
npm install marko --save
npm install webpack --save
npm install marko-loader --save
```

## 客户端循环

假设我们有一个简单的视图，我们要在浏览器中渲染：

_hello.marko_
```marko
<h1>Hello ${input.name}</h1>
``` 

First, let's create a `client.js` that requires the view and renders it to the body:

_client.js_
```js
var myComponent = require('my-component');

myComponent.renderSync({ name:'Marko' }).appendTo(document.body);
```

Now, let's configure `webpack` to compile the `client.js` file and use `marko-loader` for any `*.marko` files:

_webpack.config.js_
```js
module.exports = {
    entry: "./client.js",
    output: {
        path: __dirname,
        filename: "static/bundle.js"
    },
    resolve: {
        extensions: ['.js', '.marko']
    },
    module: {
        loaders: [
            {
                test: /\.marko$/,
                loader: 'marko-loader'
            }
        ]
    }
}
```

Run `webpack` from your terminal and you'll have a new `static/bundle.js` file created.  Reference that from an html file and you're good to go.

_index.html_
```html
<!doctype html>
<html>
<body>
    <script src="static/bundle.js"></script>
</body>
</html>
```

Load up that page in your browser and you should see `Hello Marko` staring back at you.

## Using CSS pre-processors

If you're using inline css with pre-processors, you must configure the appropriate loader.

_pretty.marko_
```marko
style.less {
    .pretty {
        color:@pretty-color;
    }
}

<div.pretty/>
```

_webpack.config.js_
```js
//...
    loaders: [
        //...
        {
            test: /\.less$/, // matches style.less { ... } from our template
            loader: "style-loader!css-loader!less-loader!"
        },
        //...
    ]
//...
```
## Extracting CSS

It is recommended to configure the [`ExtractTextPlugin`](https://www.npmjs.com/package/extract-text-webpack-plugin) so that you get a separate css bundle rather than it being included in the JavaScript bundle.

```
npm install extract-text-webpack-plugin --save
```

_webpack.config.js_
```js
'use strict';
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./client.js",
    output: {
        path: __dirname,
        filename: "static/bundle.js"
    },
    resolve: {
        extensions: ['.js', '.marko']
    },
    module: {
        loaders: [
            {
                test: /\.marko$/,
                loader: 'marko-loader'
            },
            {
                test: /\.(less|css)$/,
                loader: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader!less-loader"
                })
            }
        ]
    },
    plugins: [
        // Write out CSS bundle to its own file:
        new ExtractTextPlugin('static/bundle.css', { allChunks: true })
    ]
};
```
# 快速上手

开启一个`Marko`项目最简单的方式，是使用我们提供的[在线工具](https://markojs.com/try-online), 你可以在另一个窗口打开它，并开始你的`Coding`之旅。如果你更喜欢在本地进行开发，请移步至[安装](./installing.md)页面。

## Hello world

Marko让表达你的UI这件事变得尤为简单，它使用了类似于HTML的语法，就像这样：

_hello.marko_
```marko
<h1>Hello World</h1>
```

事实上，Marko非常像HTML，因此你可以用它来代替常见的模板语言，诸如`handlebars`、`mustache`或者`pug`。

_template.marko_
```marko
<!doctype html>
<html>
<head>
    <title>Hello World</title>
</head>
<body>
    <h1>Hello World</h1>
</body>
</html>
```

然而，Marko不仅仅是一个模板语言，它更像一个UI库，允许你将你的应用分离成独立的组件，并描述视图如何随着时间变化，以及响应用户的操作。

在浏览器中，当表达UI的数据发生变化时，Marko将会自动并且高效地更新DOM，来反应数据的变化。

## 一个简单的组件

假设我们有一个`<button>`标签，当它被点击时，我们要为它分配一些行为：

_button.marko_
```marko
<button>Click me!</button>
```

`Marko` 让这一切变得很简单，允许你直接为在`.marko`视图中的组件定义一个 `class`，并采用`on-`属性来调用`class`中的方法：

_button.marko_
```marko
class {
    sayHi() {
        alert(`Hi!`);
    }
}

<button on-click('sayHi')>Click me!</button>
```

### 添加状态

当点击一个按钮时，触发`alert`是极好的，但是，如果如果是要通过更新UI来响应你的点击行为呢？Marko的有状态组件让这变得非常简单，你需要做的只是去设置组件内部的 `this.state`， 它将会产生一个新的 `state` 变量用于你的视图。当一个位于 `this.state` 中的状态值发生改变时，视图将会自动地重新渲染，而且只会更新DOM变化的那一部分。

_counter.marko_
```marko
class {
    onCreate() {
        this.state = {
            count:0
        };
    }
    increment() {
        this.state.count++;
    }
}

<div>The current count is ${state.count}</div>
<button on-click('increment')>Click me!</button>
```

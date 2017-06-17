# 语法

Marko 采用了基于`HTML`的语法，所以可能已经很熟悉了。同时，Marko还扩展了`HTML`语言，添加了一些我们即将介绍的一些不错的特性。


> **ProTip:** Marko 同时也支持 [beautiful concise syntax](./concise.md). 如果您希望使用此语法查看我们的文档，只需单击任何Marko代码示例角落中的`switch syntax`按钮。

## 插值

当你渲染Marko模板时，你可以将模板中需要的数据传递给`input`，接着，你可以使用`${}`在模板中进行插值：

```marko
<div>
    Hello ${input.name}
</div>
```

值得注意的是，你可以在此处传递任何JavaScript表达式，该表达式的结果将会被插入到最终输出的HTML中：

```marko
<div>
    Hello ${'world'.toUpperCase()}
</div>
```

这些值会被自动转义(escaped)，这可以避免你意外地插入恶意代码。如果你需要传递非转义的HTML，你可以使用`$!{}`

```marko
<div>
    Hello $!{htmlThatWillNotBeEscaped}
</div>
```

### 转义占位符

如果需要的话，您可以使用反斜杠`\`将`$`转义, 为将其视为普通文本，而不是占位符标记：

```marko
<div>
    Placeholder example: <code>\${input}</code>
</div>
```

## 顶层文本

在模板顶层（处于任何标签之外）的本本必须采用 [concise syntax's `--`](./concise.md#text) 语法来添加前缀，以表示它是文本，这时，解析器将会以`concise`模式启动，否则解析器将会尝试将你想要作为文本的内容解析成一个简明的标签声明。

```marko
-- Root level text
```

## 类型属性

比HTML更大的改进是Marko提供的类型属性（而不只是字符串）：

```marko
<div class=input.myClassName/>
<input type="checkbox" checked=input.isChecked/>

<tag string="Hello"/>
<tag number=1/>
<tag template-string=`Hello ${name}`/>
<tag boolean=true/>
<tag array=[1, 2, 3]/>
<tag object={hello: 'world'}/>
<tag variable=name/>
<tag function-call=input.foo()/>
```

### 属性表达式

任何JavaScript表达式都是有效的属性值，只要它符合以下条件：

_不包含任何空格_

```marko
<tag sum=1+2 difference=3-4/>
```
```marko
tag sum=1+2 difference=3-4
```

_空格被包含在 `()`, `[]`, or `{}`_
```marko
<tag sum=(1 + 2) difference=(3 - 4)/>
```
```marko
tag sum=(1 + 2) difference=(3 - 4)
```

_或者, 逗号用于分割属性_
```marko
<tag sum=1 + 2, difference=3 - 4/>
```
```marko
tag sum=1 + 2, difference=3 - 4
```

> **注意:** 如果你使用逗号分隔两个属性，则必须使用逗号分隔该标签的_所有_属性.

#### 属性空格

空格可以可选地在属性等号的周围使用：

```marko
<tag value = 5/>
```
```marko
tag value = 5
```

### 条件属性

如果一个属性值表达式求值为`null`或者`false`，那么该属性将不会被包含在输出中：

```marko
<div class=(active && 'tab-active')>Hello</div>
```

当`active`的值为`true`时， 输出结果如下:

```html
<div class="tab-active">Hello</div>
```

相应的，当`active`的值为`false`时， 输出结果如下:

```html
<div>Hello</div>
```

### 属性

您可以在一个开放的HTML标签中使用 `${}` 语法来将对象的属性合并为该HTML标签的属性：

_index.js_
```js
template.render({ attrs:{ class:'active', href:'https://ebay.com/' } });
```

_link.marko_
```marko
<a ${input.attrs} target="_blank">eBay</a>
```

将会得到下面的HTML：

_output.html_
```html
<a class="active" href="https://ebay.com/" target="_blank">eBay</a>
```

### style 属性

您可以像HTML一样传递一个字符串作为`style`的值，但是Marko还支持传递一个对象作为`style`属性的值：

```marko
<div style={ color:'red', fontWeight:'bold' }/>
```

输出:

```html
<div style="color:red;font-weight:bold;"></div>
```

### class 属性

`class`属性也支持对象表达式或数组表达式（除了支持字符串值外），如下所示：

```marko
<!-- array: -->
<div class=['a', null, 'c']/>

<!-- object: -->
<div class={ a:true, b:false, c:true }/>
```

在这两种情况下，输出将会相同：

_output.html_
```html
<div class="a c"></div>
```

## 简写属性

Marko提供了在元素上声明`class`和`id`简写（熟悉的emmet）：

_source.marko_
```marko
<div.my-class/>
<span#my-id/>
<button#submit.primary.large/>
```

将会产生这样的HTML:

_output.html_
```html
<div class="my-class"></div>
<span id="my-id"></span>
<button id="submit" class="primary large"></button>
```

## 指令

指令采用圆括号表示，并采用参数而不是值。许多指令可以同时用作标签和属性：

```marko
<if(true)>
    <strong>Marko is awesome</strong>
</if>
```

下面是用作属性的相同的 `if()` 指令：

```marko
<strong if(true)>
    Marko is awesome
</strong>
```

大多数指令支持JavaScript表达式，有些甚至支持多个参数：

```marko
<include(target, input)/>
```

有一些允许自定义语法：

```marko
<for(item in items)/>
```

marko 内置了很多用于控制(如 `<if>`、`<else-if>`、`<for>`等等)及其他场景的 [核心指令](./core-tags.md)，当然，你也可以 [自定义指令](./custom-tags.md) 并使用它们。

## 内联 JavaScript

> **ProTip:** 如果你发现自己写了很多内联的JS，可以考虑把它们移动到一个外部文件，然后[`import`](./core-tags.md#codeimportcode)进来。

想要在模板中执行JavaScript，可以使用`$ <code>`语法来插入一个Javascript语句。

以`$`开始的一行，后面紧跟一个空格，marko将会执行紧随其后的Javascript代码：

```marko
$ var name = input.name;

<div>
    Hello, ${name}
    $ console.log('The value rendered was', name);
</div>
```

声明将会持续到后面的新行是否被 `{}`、`[]`、 `()`、 ``` `` ``` 或者 `/**/` 界定。

```marko
$ var person = {
    name: 'Frank',
    age: 32
};
```

可以通过将多个语句包装在块中来使用多个语句或无界语句：

```marko
$ {
    var bgColor = getRandomColor();
    var textColor = isLight(bgColor)
        ? 'black'
        : 'white';
}
```

### 静态 JavaScript

> **Static:** 模板加载后，并已经被render方法调用，跟随在`static`后面的JavaScript将只会执行一次。它必须在顶层声明，并且无法访问在render中传递的值。

在每次渲染模板时，内联JavaScript都会运行，如果你只想初始化一些值，请使用`static`关键字：

```marko
static var count = 0;
static var formatter = new Formatter();

static function sum(a, b) {
    return a + b;
};

<div>${formatter.format(sum(2, 3))}</div>
```
和内联JavaScript一样，静态的多行语句或无界语句也可以通过包装在一个块中来使用：

```marko
static {
    var base = 2;
    function sum(a, b) {
        return base + a + b;
    };
}
```

### 转义 $ 符号

如果你需要在某一行开头输出一个`$`，你可以转义(escape)它: `\$`:

```marko
<p>You can run JS in a Marko template like this:</p>
<code>
    \$ var num = 123;
</code>
```

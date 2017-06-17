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

### 动态属性

您可以在一个开放的HTML标签中使用 `${}` 语法来将对象的属性合并为该HTML标签的属性：

_index.js_
```js
template.render({ attrs:{ class:'active', href:'https://ebay.com/' } });
```

_link.marko_
```marko
<a ${input.attrs} target="_blank">eBay</a>
```

would output the following HTML:

_output.html_
```html
<a class="active" href="https://ebay.com/" target="_blank">eBay</a>
```

### Style attribute

You can pass a string as the value of `style` just as you would in HTML, but Marko also supports passing an object as the value of the `style` attribute:

```marko
<div style={ color:'red', fontWeight:'bold' }/>
```

Output:

```html
<div style="color:red;font-weight:bold;"></div>
```

### Class attribute

The `class` attribute also support object expressions or an array expressions (in addition to a string value) as shown below:

```marko
<!-- array: -->
<div class=['a', null, 'c']/>

<!-- object: -->
<div class={ a:true, b:false, c:true }/>
```

In both cases, the output will be the same:

_output.html_
```html
<div class="a c"></div>
```

## Shorthand attributes

Marko provides a shorthand for declaring classes and ids on an element:

_source.marko_
```marko
<div.my-class/>
<span#my-id/>
<button#submit.primary.large/>
```

Yields this HTML:

_output.html_
```html
<div class="my-class"></div>
<span id="my-id"></span>
<button id="submit" class="primary large"></button>
```

## Directives

Directives are denoted by parenthesis and take an argument instead of a value.  Many directives may be used as both tags and attributes.

```marko
<if(true)>
    <strong>Marko is awesome</strong>
</if>
```

Below is the same `if()` directive used as an attribute:

```marko
<strong if(true)>
    Marko is awesome
</strong>
```

Most directives support JavaScript expressions, and some even support multiple arguments:

```marko
<include(target, input)/>
```

Others allow a custom syntax:
```marko
<for(item in items)/>
```

Directives are used by many of our [Core Tags](./core-tags.md) for control-flow (`<if>`, `<else-if>`, `<for>`, etc.) and other features.  You can also use them in your own [Custom Tags](./custom-tags.md).

## Inline JavaScript

> **ProTip:** If you find yourself writing a lot of inline JS, consider moving it out to an external file and then [`import`](./core-tags.md#codeimportcode) it.

To execute JavaScript in your template you can insert a Javascript statement using the `$ <code>` syntax.

A line that starts with a `$` followed by a space will execute the code that follows.

```marko
$ var name = input.name;

<div>
    Hello, ${name}
    $ console.log('The value rendered was', name);
</div>
```

A statement may continue onto subsequent lines if new lines are bounded by `{}`, `[]`, `()`, ``` `` ```, or `/**/`:

```marko
$ var person = {
    name: 'Frank',
    age: 32
};
```

Multiple statements or an unbounded statement may be used by wrapping the statement(s) in a block:

```marko
$ {
    var bgColor = getRandomColor();
    var textColor = isLight(bgColor)
        ? 'black'
        : 'white';
}
```

### Static JavaScript
> **Static:** The JavaScript code that follows `static` will run once when the template is loaded and be shared by all calls to render. It must be declared at the top level and does not have access to values passed in at render.

Inline JavaScript will run each time your template is rendered, if you only want to initialize some values once, use the `static` keyword:

```marko
static var count = 0;
static var formatter = new Formatter();

static function sum(a, b) {
    return a + b;
};

<div>${formatter.format(sum(2, 3))}</div>
```

Like inline Javascript, multiple statements or an unbounded statement may be used by wrapping the statement(s) in a block:

```marko
static {
    var base = 2;
    function sum(a, b) {
        return base + a + b;
    };
}
```

### Escaping dollar signs

If you need to output a `$` at the beginning of a line, you can escape it: `\$`.

```marko
<p>You can run JS in a Marko template like this:</p>
<code>
    \$ var num = 123;
</code>
```

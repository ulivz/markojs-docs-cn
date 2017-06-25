# 组件

Marko可以轻松地将组件的`class`和`style`与它们对应的`HTML`进行定位。

## 单文件组件

Marko允许你在`.marko`文件中为组件定义一个`class`，并使用`on *`属性调用该类的方法：

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
<button on-click('increment')>+1</button>
```

### Styles

向你的视图添加样式也非常容易，这些样式不会像内联样式一般输出在`<style>`标签中，但会导致样式被外部化，因此如果组件在页面上多次使用，则不会重复。

Adding styles to your view is also made easy.  These styles won't be output in a `<style>` tag as inline styles usually are, but will result in the style being externalized so it isn't duplicated should a component be used more than once on the page.

```marko
style {
    button.primary {
        background-color:#09c;
    }
}

<div>The current count is ${state.count}</div>
<button.primary on-click('increment')>+1</button>
```

如果想使用css预处理器，你可以在`style`上添加扩展名：
```marko
style.less {
    button.primary {
        background-color: @primaryColor;
    }
}
```

## 多文件组件


你可能更喜欢将组件的class和style的定义与视图的定义（经典的HTML、CSS与JavaScript的分离）保持在单独的文件中，Marko通过简单的基于文件名的约定来实现这一点。

> **ProTip:** 如果你将组件的类和样式移动到单独文件的动机是因为代码变得太大，请考虑将组件分成更小、更易于管理的组件。

### 支持的文件

Marko会自动在与Marko视图相同的目录中发现所支持的文件。例如，如果有一个名为`counter.marko`的视图，Marko会在该目录下自动查找`counter.component.js`和`counter.style.css`。

```
counter.marko
counter.component.js
counter.style.css
```

Marko还会专门处理名为`index.marko`的视图，除了`index.component.js`和`index.style.css`外，还会查找`component.js`和`style.css`。这样可以轻松地将组件文件分组到一个目录中：

```
counter/
    index.marko
    component.js
    style.css
```

在你的 `component.js` 文件中导出组件的`class`：

```js
module.exports = class {
    onCreate() {
        this.state = {
            count:0
        };
    }
    increment() {
        this.state.count++;
    }
}
```

在你的 `index.marko` 中，你可以使用`on *`属性来引用`class`中的方法

```marko
<div>The current count is ${state.count}</div>
<button on-click('increment')>+1</button>
```

在你的`style.css`中，定义样式如下：
```css
button.primary {
    background-color:#09c;
}
```

> **ProTip:** 除了查找`[name].style.css`之外，Marko实际上也会查找`[name].style。*`，所以它也会找到你正在使用的任何css预处理程序（less, stylus, scss等）



### 具有普通对象的组件

如果您使用的浏览器不支持类，则可以导出一个普通对象：

```js
module.exports = {
    onCreate: function() {
        this.state = {
            count:0
        };
    },
    increment: function() {
        this.state.count++;
    }
}
```

## split组件

split组件允许你在组件在服务器上渲染、但不需要在浏览器中重新渲染的情况下进行优化。因为组件不需要在浏览器中渲染，所以模板不需要发送到浏览器。在某些情况下，这可以会减少你页面几百个字节的大小。

> **Note:** 如果分割组件是有状态组件的后代，则完整的渲染逻辑仍将被发送，因为父组件可能会将新的输入传递给拆分组件，从而要求重新渲染。

另外，如果页面上呈现的 _所有_ 组件都是拆分组件，则Marko的`VDOM`和`rendering runtime`不是必需的，因此不会发送到浏览器，这可以进一步将页面的大小减少几千字节。

> **ProTip:** 不要过度优化。如果你的组件真的不需要重新渲染，请继续进行拆分，但是不要放弃有状态组件的重新渲染，这将使你的代码更易于维护。

### 用法

Marko以类似于发现外部组件类的方式发现split组件。

举个例子，如果你有一个名为`button.marko`的视图，它将自动查找`button.component-browser.js`。如果你的视图被命名为`index.marko`，那么除了`index.component-browser.js`之外，它还会查找`component-browser.js`。

```
counter/
    index.marko
    component-browser.js
```

split组件也可能将一些初始化设置作为初始渲染的一部分。在这种情况下，该组件可能需要定义第二个组件类，以使用`onCreate`，`onInput`和`onRender`等[生命周期钩子](#lifecycle)。该类可以从`component.js`导出，也可以在模板中直接定义为单文件组件。

### 示例

_index.marko_
```marko
class {
    onCreate() {
        this.number = 123;
    }
}

<div on-click('shout')/>
```

_component-browser.js_
```js
module.exports = {
    shout() {
        alert('My favorite number is ' + this.number + '!');
    }
}
```

## 属性

### `on-[event](methodName, ...args)`

`on-*` 属性用于在组件上设置一个事件侦听器。当用户交互或其他组件触发该事件时，将调用该组件提供的方法。Marko会检查变化并更新对应的UI。

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `event` | `String` | 要监听的事件的名称 |
| `methodName` | `String` | 在触发事件时调用组件类的方法的名称 |
| `...args` | `Any` | 所有后续参数都将附加到传递给组件方法的参数中 |

```marko
class {
    sayHello(name) {
        alert('Hello ' + name + '!');
    }
}

<button on-click('sayHello', 'Frank')>Say Hello to Frank</button>
```

上面的组件也将在`name`之后收到以下参数：
+ `evt` 为DOM事件
+ `el` 为DOM元素

将一个事件发送给父组件，它会接收到`component`，而不是用于触发它的子组件的`evt，el`。

让我们比较我们如何使用DOM，jQuery以及Marko来处理事件。

JavaScript/DOM:

```html
<input id="txt" type="text">

<script>
window.addEventListener('load', function() {
    var txt = document.getElementById('txt');
    txt.addEventListener('input', function (evt) { /* evt.target */ });
    txt.addEventListener('blur', function (evt) { /* evt.target */ });
});
</script>
```

jQuery:

```html
<input id="txt" type="text">

<script>
$(function () {
    $('#txt').on('input', function (evt) { /* evt.target */ })
        .on('blur', function (evt) { /* evt.target */ });
});
</script>
```

Marko:

```marko
class {
    input(evt, el) { ... }
    blur(evt, el) { ... }
}
<input type="text" on-input('input') on-blur('blur')>
```

Marko中处理事件的语法很简单。在接受额外的参数的情况下，它要简单得多。

在服务器上不会触发任何事件。它们仅在嵌入到浏览器中之后才能应用。

基本的用途是接受像`click`, `input`, `submit`这样的DOM事件。

或者，子组件可以将消息`冒泡`给父组件以使用事件系统。使用`在线实时编辑器`，查看[父子组件通信的一个示例](http://markojs.com/try-online?file=%2Flanguage-guide%2Fattributes%2Fevents.marko&gist=)

### `key`

一个key是一个范围的`id`。 `key`属性可以应用于UI组件的HTML元素和自定义标签。

如果应用在HTML元素上，则会将唯一的`id`属性添加到HTML元素上。分配的ID将会是父组件ID与`key`属性的提供值的连接。

如果应用于UI组件，那么`key`将用于为目标组件及其所有子组件（包括嵌套组件和嵌套HTML元素）分配唯一的ID。

key允许组件轻松获取对嵌套HTML元素和嵌套UI组件的引用。另外，当更新DOM时，被key标记的元素和组件被保证被匹配和重新使用，而不是被丢弃和重新创建。

_input.marko_
```marko
<div.container>
    <button key="myButton" type="button">My Button</button>
</div>
```

将生成类似于下面的HTML：

_output.html_
```html
<div.container>
    <button id="w0-myButton" type="button">My Button</button>
</div>
```

包含的组件可以使用以下代码引用嵌套的DOM元素：
```js
var myButton = this.getEl('myButton');
```

`key`属性也可以通过追加`[]`来应用于重复的元素：

_input.marko_
```marko
<ul>
    <for(color in ['red', 'green', 'blue'])>
        <li key="colors[]">${color}</li>
    </for>
</ul>
```

将会生成类似于下面的HTML:

_output.html_
```html
<ul>
    <li key="colors[0]">red</li>
    <li key="colors[1]">green</li>
    <li key="colors[2]">blue</li>
</ul>
```

包含组件可以使用以下代码引用重复的DOM元素：

```js
var colorLIs = this.getEls('colors'); // 返回一个 HTMLElement nodes 的数组
```

### `for-key`

 [HTML `<label>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label) 标签 `for` 属性需要一个 `id`作为它的值，`for-key` 允许你通过它的`key`来引用一个可标注的元素：

```marko
<label for-key="name">Name</label>
<input key="name" value="Frank"/>
```

### `no-update`

保留与DOM元素或组件关联的DOM子树，重新渲染UI组件时不会被修改。

```marko
<div>
    <!-- Don't ever re-render this table -->
    <table no-update>
        ...
    </table>
</div>
```

```marko
<div>
    <!-- Don't ever re-render this UI component -->
    <app-map no-update/>
</div>
```

### `no-update-if`

类似于[no-update](#codeno-updatecode)，除了DOM子树是有条件被保留：

```marko
<div>
    <!-- Don't ever re-render this table if the condition is met -->
    <table no-update-if(input.tableData == null)>
        ...
    </table>
</div>
```

### `no-update-body`

类似于 [no-update](#codeno-updatecode)，除了只有子DOM子节点被保留：

```marko
<!-- Don't ever re-render any nested DOM elements -->
<div no-update-body>
    ...
</div>
```

### `no-update-body-if`

类似于[no-update-body](#codeno-update-bodycode)， 除了只有子DOM子节点有条件地被保留：

```marko
<div>
    <!-- Don't ever re-render any nested DOM elements if the condition is met -->
    <table no-update-body-if(data.tableData == null)>
        ...
    </table>
</div>
```

### `:no-update`

用于防止在重新渲染期间修改指定元素的属性，不应修改的属性应该有一个`:no-update`作为后缀：

```marko
<!-- Don't ever modify the class attribute -->
<div class:no-update=input.className>
    ...
</div>
```

## 属性

### `this.el`

组件绑定的根 [HTML element](https://developer.mozilla.org/en-US/docs/Web/API/element) 如果有多个根元素，将是第一个。

### `this.els`

组件绑定的根 [HTML elements](https://developer.mozilla.org/en-US/docs/Web/API/element) 的数组。

### `this.id`

组件绑定的根  [HTML element](https://developer.mozilla.org/en-US/docs/Web/API/element) 的字符串ID。

### `this.state`

组件的当前状态。更改`this.state`或其任何直接属性将导致重新渲染组件。

只有当`this.state`被首先定义时，才会监听属性的变化。如果你在初始化不需要属性，可以将其设置为`null`。

```marko
class {
    onCreate() {
        this.state = {
            data: null,
            error: null
        }
    }
    getData() {
        fetch('/endpoint')
            .then(data => this.state.data = data)
            .catch(error => this.state.error = error);
    }
}
```

请注意，设置`state`属性仅指定了组件一个可能的渲染器，并且属性仅仅会在一层的深度下监听。因此，只有至少一个组件状态的属性发生更改（`oldValue !== newValue`）时，则该组件才会被重新渲染。

如果没有任何一个属性发生改变（因为新旧值相同或者通过浅比较没有检测到），那么这个赋值操作被认为是一个no操作（对于性能很好）。

我们建议使用 [immutable](https://wecodetheweb.com/2016/02/12/immutable-javascript-using-es6-and-beyond/) 数据结构，但是如果需要更改状态属性（假设会新增新项目到数组中），可以使用`setStateDirty`将其标记为脏状态。

```js
this.state.numbers.push(num);

// mark numbers as dirty, because a `push`
// won't be automatically detected by Marko
this.setStateDirty('numbers');
```

### `this.input`

组件的当前输入，设置`this.input`将导致组件被重新渲染。

## 变量

当编译一个Marko组件时，一些附加变量可用于渲染函数，这些变量如下所述。

### `component`

`component`变量代表正在渲染的当前UI组件的实例，该变量可用于调用UI组件实例上的方法。

```marko
class {
    getFullName() {
        var person = this.input.person;
        return person.firstName + ' ' + person.lastName;
    }
}

<div>Hello ${component.getFullName()}</div>
```

### `input`

`input`变量指的输入对象，等价于`component.input`|`this.input`。

```marko
<div>Hello ${input.name}</div>
```

### `state`

`state`变量指的是UI组件的状态对象，等价于未被监听的 `component.state` |`this.state`。

```marko
<div>Hello ${state.name}</div>
```

## 方法

### `destroy([options])`

| 选项  | 类型 | 默认值 | 描述 |
| ------- | ---- | ------- | ----------- |
| `removeNode` | `Boolean` | `true` | `false` 将组件保留在DOM中，同时取消订阅所有事件 |
| `recursive` | `Boolean` | `true` | `false` 将防止子组件被销毁 |

通过使用`subscribeTo`方法取消订阅所有监听器，然后从DOM中分离组件的根元素来销毁该组件。 所有嵌套组件（通过查询DOM发现）也将会被销毁。

```javascript
component.destroy({
	removeNode: true, //true by default
	recursive: true //true by default
})
```

### `forceUpdate()`

重新渲染组件队列，并跳过所有检查，以检查是否真的需要它。

> 当使用 `forceUpdate()` 时，DOM的更新将会被排队，如果要立即更新DOM，需要在调用`this.forceUpdate()`后调用`this.update()`。

### `getEl([key, index])`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `key` | `String` | _可选的_ 元素范围标识符 |
| `index` | `Number` | 如果 `key` 引用了一个  _repeated_ 的元素，则该值为 _可选的_ 元素的索引 |
| 返回值 | `HTMLElement` | 如果没有给定`key`，则匹配该键的元素或`this.el` |

通过将提供的`key`与组件的ID前缀返回嵌套的DOM元素。 对于Marko，嵌套的DOM元素应该使用`key`自定义属性分配一个ID。

### `getEls(key)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `key` | `String` | 元素范围标识符 |
| 返回值 | `Array<HTMLElement>` | 对于给定`key`的 _repeated_ DOM元素的数组 |

Repeated 的DOM元素必须具有以`[]`结尾的`key`属性的值（例如`key="items[]"`）

### `getElId([key, index])`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `key` | `String` |  _可选的_ 元素范围标识符 |
| `index` | `Number` | 如果 `key` 引用了一个  _repeated_ 的元素，则该值为 _可选的_ 元素的索引 |
| 返回值 | `String` | 如果`key`未定义，则返回与该key匹配的元素的ID或`this.el.id` |

与`getEl`类似，但只返回嵌套DOM元素的字符串ID，而不是实际的DOM元素。

### `getComponent(key[, index])`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `key` | `String` | 元素范围标识符 |
| `index` | `Number` | 如果 `key` 引用了一个  _repeated_ 的元素，则该值为 _可选的_ 元素的索引 |
| 返回值 | `Component` | 给定key的嵌套`组件`的引用。 如果给定了`index`，且目标组件是 _repeated_ 的组件（例如`key="items[]"`），则将返回给定索引处的组件。|

### `getComponents(key, [, index])`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `key` | `String` | 元素范围标识符 |
| `index` | `Number` | _可选的_ 组件的索引, 如果 `key` 引用一个 _repeated_ 的组件 |
| 返回值 | `Array<Component>` | 一个给定key的 _repeated_ `组件` 实例的数组 |

Repeated的组件必须具有以`[]`结尾的`key`属性的值（例如`key="items[]"`）

### `isDestroyed()`

如果组件已通过[`component.destroy()`](#codeondestroycode)被销毁，返回`true`，否则返回`false`。

### `isDirty()`

### `replaceState(newState)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `newState` | `Object` | 一个新的状态对象，用于替代以前的状态 |

用全新的状态替代旧状态，相当于 `this.state = newState`.

> **Note:** 虽然`setState()`是做加法，但不会删除处于旧状态但不在新状态的属性，`replaceState()`将添加新状态，并删除在新状态下未找到的旧状态属性。 因此，如果使用`replaceState()`，如果新状态包含比待替换状态更少的或者其他的属性，则必须考虑可能产生的副作用。

### `rerender([input])`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `input` | `Object` | 当重新渲染时，_可选的_ 新的输入数据 |

使用其`renderer`重新渲染组件，并提供 `input` 或者内部的 `input` 和 `state`。

### `setState(name, value)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `name` | `String` | 要更新的状态属性的名称 |
| `value` | `Any` | 状态属性的新值 |

用于更改单个状态属性的值，相当于`this.state[name] = value`，除此之外，也可以用于向组件状态添加新属性。

```javascript
this.setState('disabled', true);
```

### `setState(newState)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `newState` | `Object` | 一个新的状态对象，用于合并到之前的状态 |

用于更改多个状态属性的值。

```js
this.setState({
	disabled: true,
	size: 'large'
});
```

### `setStateDirty(name[, value])`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `name` | `String` | 需要被标记为脏状态的状态属性的名称 |
| `value` | `Any` | _可选的_ 状态属性的新值 |

即使给定的值等于旧值，也会强制更改状态属性。这对于在一个复杂的对象发生变化而不会被浅比较检测到的情况是有帮助的。调用此函数可以完全避开所有属性的等式检查（浅比较），并始终重新渲染该组件。

#### 更多细节

第一个参数`name`用于允许更新处理函数（例如：`update_foo(newValue)`）来处理标记为脏的特定状态属性的状态转换。 第二个参数`value`用作给予更新处理函数的新值。 因为`setStateDirty()`总是绕过所有的属性相等性检查，所以这个参数是可选的。 如果未给出或者等于旧值，旧值将用于更新处理程序。
重要的是，给定的参数不会影响如何或者是否 `setStateDirty()` 会重新渲染一个组件，它们只会被视为更新处理函数的附加信息。

_example.js_

```javascript
// 因为这不会创建一个新的数组，
// 所以这个变化不会被浅属性比较来检测
this.state.colors.push('red');

// 强制指定特定的状态属性是脏的
// 因此会触发组件的视图的更新
this.setStateDirty('colors');
```

### `subscribeTo(emitter)`

| 参数  | 描述 |
| ------- | ----------- |
| `emitter` | 一个 node.js [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter) 或者一个发出事件的DOM对象 (`window`, `document`, 等.) |
| 返回值 | 跟踪订阅 |

当组件被销毁时，有必要删除组件附加的任何监听器，以防止内存泄漏。 通过使用`subscribeTo`，当组件被销毁时，Marko将自动跟踪和删除附加的任何事件监听器。

Marko 使用 [`listener-tracker`](https://github.com/patrick-steele-idem/listener-tracker) 来实现这个特性.

_example.js_
```js
this.subscribeTo(window).on('scroll', () => {
    console.log('The user scrolled the window!');
});
```

### `update()`

立即执行DOM的任何未完成的更新，而不是遵循正常的排队更新机制进行渲染。

```js
this.setState('foo', 'bar');
this.update(); // 强制DOM更新
this.setState('hello', 'world');
this.update(); // 强制DOM更新
```

## 事件

一个 Marko 组件继承自 [`EventEmitter`](https://nodejs.org/api/events.html#events_class_eventemitter)， 以下是一些常用的方法，查看文档以查看完整的方法列表。

### `emit(eventName, ...args)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `eventName` | `String` | 可被监听的的事件的名称 |
| `...args` | `Any` | 所有需要传递给监听器的后续参数 |

同步地按照注册的顺序调用名称为`eventName`的事件注册的每个监听器，并将给定的参数传递给每个监听器。


### `on(eventName, handler)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `eventName` | `String` | 可被监听的的事件的名称 |
| `handler` | `Function` | 当事件触发时调用的函数 |

将listener函数添加到名为eventName的事件的listeners数组的末尾，不会检查是否已经添加了监听器。若传递相同组合的eventName和listener，将会导致监听器被添加并被多次调用。

### `once(eventName, handler)`

| 参数  | 类型 | 描述 |
| ------- | ---- | ----------- |
| `eventName` | `String` | 可被监听的的事件的名称 |
| `handler` | `Function` | 当事件触发时调用的函数 |

为名为eventName的事件添加一次性的监听器函数。第一次触发eventName时，将删除该监听器，然后调用此监听器。

## 生命周期

Marko定义了六个不同的生命周期钩子，在组件的生命周期中的特定时间点可以调用这些方法。

```
                                         ⤺
create → input → render → mount → render   update → destroy
                                         ⤻
```

> **ProTip:** 当在浏览器中出现生命周期事件时，相应的事件将在组件实例上发出，父组件或者可访问组件实例的其他代码可以监听这些事件，例如：

```js
component.on('destroy', function() {
    // 组件已被销毁！
});
```

### `onCreate(input, out)`

| 参数  | 描述 |
| ------- | ----------- |
| `input` | 用于第一次渲染组件的输入数据 |
| `out`   | 用于第一次渲染组件的异步`out` |

当第一次创建组件时，会触发`create`事件（并调用`onCreate`）。

`onCreate`通常用于设置状态组件的初始状态：

_example.marko_
```marko
class {
    onCreate(input) {
        this.state = { count:input.initialCount };
    }
}

// ...
```

### `onInput(input)`

| 参数  | 描述 |
| ------- | ----------- |
| `input` | 新的输入数据 |

当该组件接收到输入时，会发出`input`事件（并调用`onInput`）：初始时的输入和其他任何后续更新的输入。

### `onRender(out)`

| 参数  | 描述 |
| ------- | ----------- |
| `out`   | 当前渲染的异步`out` |

当组件即将被渲染（或重新渲染）时，`render`事件被触发（并调用`onRender`）。

### `onMount()`

当组件首次插入到DOM中时，将发出`mount`事件（并调用`onMount`）。对于服务器渲染的组件，这是在浏览器中发出的第一个事件。

这是`this.el`和`this.els`定义的第一个点。 `onMount`通常用于附加第三方的javascript库（或者如果你仍然使用`jQuery`的话）到新插入的DOM元素中。

例如，附加一个监听组件是否在视口中的库：

_example.marko_
```marko
import scrollmonitor from 'scrollmonitor';

class {
    onMount() {
        this.watcher = scrollmonitor.create(this.el);
        this.watcher.enterViewport(() => console.log('I have entered the viewport'));
        this.watcher.exitViewport(() => console.log('I have left the viewport'));
    }
}

// ...
```

### `onUpdate()`

当组件被重新渲染且DOM已被更新后，会触发`update`事件（并调用`onUpdate`）。 如果重新渲染不会导致DOM更新（没有更改），则此事件将不会被触发。

### `onDestroy()`

当组件即将从DOM卸载并清理时，会发出`destroy`事件（并调用`onDestroy`）。 应该使用`onDestroy`清理任何超出Marko处理范围的内容。

举个例子，清理我们在[`onMount`](#codeonmountcode)例子中的 scrollmonitor:

_example.marko_
```marko{9-11}
import scrollmonitor from 'scrollmonitor';

class {
    onMount() {
        this.watcher = scrollmonitor.create(this.el);
        this.watcher.enterViewport(() => console.log('Entered the viewport'));
        this.watcher.exitViewport(() => console.log('Left the viewport'));
    }
    onDestroy() {
        this.watcher.destroy();
    }
}

// ...
```

## DOM 操作

以下方法将组件的根DOM节点从当前父元素移动到新的父元素（在`detach`的情况下，将其移出DOM）。

### `appendTo(targetEl)`

```js
this.appendTo(document.body);
```

### `detach()`

从其父节点中删除节点，从DOM分离组件的根元素。

### `insertAfter(targetEl)`

### `insertBefore(targetEl)`

### `prependTo(targetEl)`

### `replace(targetEl)`

### `replaceChildrenOf(targetEl)`

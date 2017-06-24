# 自定义标签

Marko 对你开放了编写 [核心标签](./core-tags.md) 的相同API，以便于你可以使用自定义标签和属性来扩展语言。

> **ProTip:** 建议在编写自定义标签和自定义属性时至少有一个破折号，以表示它们不是标准HTML语法的一部分。

## 编写自定义标签

首先，让我们来看看基于模板的标签，它允许您使用命名的自定义标签来包含另一个模板，而不是指定文件系统路径并使用`<include>`。

### 发现标签

在编译模板时，Marko将从模板的目录开始搜索，直到找到命名为`components/`的目录的项目根。然后尝试将这些目录的子项加载为自定义标签。这些子项可以是Marko模板，也可以是一个带有`index.marko`模板（和其他支持文件）的目录。

When compiling a template Marko will search starting at template's directory, up to the project root for directories named `components/`. It then attempts to load the children of these directories as custom tags.  The children can be a Marko template or a directory with an `index.marko` template (and other supporting files).

```目录结构
components/
    app-header/
        index.marko
        logo.png
        style.css
    app-footer.marko
pages/
    home/
        components/
            home-banner.marko
        index.marko
```

当在`pages/home/index.marko`编译模板时，会找到以下标签：

- `<app-header>`
- `<app-footer>`
- `<home-banner>`

所以现在，不需要指定一个路径：

```marko
<include('../../components/app-header/index.marko')/>
```

你可以直接使用标签名称：

```marko
<app-header/>
```

## 使用npm的标签

想要使用`npm`中的自定义标签非常容易，只需要确保npm包已正确安装并列在项目的`package.json`的依赖项（dependencies）中：

```
npm install --save some-third-party-package
```

就是这样，Marko将在编译模板时发现这些标签，你可以在模板中轻松地使用它们：

```marko
<div>
    <some-third-party-tag/>
</div>
```

## 具体细节

给定一个模板文件，`marko`将会通过相对于模板文件的路径来进行搜索来自动发现所有标签库（taglibs）。 同时将自动导入与包中根级目录下的 `package.json` 文件中的`dependencies`相关联的所有标签库（taglibs）。

举个例子，若给定一个路径为`/my-project/src/pages/login/template.marko`的模板，同时给出了一个类似于以下内容的`/my-project/package.json`：

```json
{
    "name": "my-package",
    "dependencies": {
        "foo": "1.0.0"
    },
    "devDependencies": {
        "bar": "1.0.0"
    }
}
```

搜索路径将如下所示：

1. `/my-project/src/pages/login/marko.json`
2. `/my-project/src/pages/marko.json`
3. `/my-project/src/marko.json`
4. `/my-project/marko.json`
5. `/my-project/node_modules/foo/marko.json`
6. `/my-project/node_modules/bar/marko.json`

### 隐藏标签库

如果你希望隐藏特定的文件夹或者`node_module`，以避免去寻找`marko.json`，你可以排除这些目录或者`package`，这主要用于测试。

```javascript
    require('marko/compiler').taglibFinder.excludeDir(dirPath);
    // 其中'dirPath'是包含marko.json的文件夹的绝对路径 

    require('marko/compiler').taglibFinder.excludePackage(packageName);
    // 其中'packageName'是包含marko.json的node_module的名称
     
```

在此过程中任何渲染开始之前，都应首先进行声明。


### marko.json 语法

```json
{
    "tags": {
        "my-hello": {
            "renderer": "./hello-renderer",
            "attributes": {
                "name": "string"
            }
        }
    }
}
```

Marko 还支持一种声明标签和属性的简化写法。下面的`marko.json`与上述的`marko.json`效果相同：

```json
{
    "<my-hello>": {
        "renderer": "./hello-renderer",
        "@name": "string"
    }
}
```

### 定义标签

可以通过在`marko.json`中添加`"<tag_name>": <tag_def>`属性来定义标签：

```json
{
    "<my-hello>": {
        "renderer": "./hello-renderer",
        "@name": "string"
    },
    "<my-foo>": {
        "renderer": "./foo-renderer",
        "@*": "string"
    },
    "<my-bar>": "./path/to/my-bar/marko-tag.json",
    "<my-baz>": {
        "template": "./baz-template.marko"
    }
}
```

每个标签都应该和一个`renderer`或模板相关联。当模板中使用自定义标签时，那么将在渲染时调用`renderer`（或模板）以生成HTML/输出。如果`String`路径指向一个自定义标签的`marko-tag.json`，那么将加载该`marko-tag.json`来定义标签。

### 定义属性

如果你增加了属性标识，则Marko编译器将进行验证，以确保仅提供支持的属性。通配符属性(`"@*"`)允许传入任何属性。以下是一个定义属性的示例：

_Multiple attributes:_

```javascript
{
    "@message": "string",     // String
    "@my-data": "expression", // JavaScript expression
    "@*": "string"            // Everything else will be added to a special "*" property
}
```


### 自定义目录扫描

你可以在`marko.json`中配置`tags-dir`值，以配置标记扫描的自定义标签的目录名称。如上所述，默认情况下它使用名称`components/`。 你可以在目录级别覆盖此目录，并给出要扫描的另一个目录的路径：

```json
{
    "tags-dir": "./ui-components"
}
```

如果你将`taglib`组织在多个文件夹中，`tags-dir`也可以接受一个数组。

```json
{
    "tags-dir": ["./ui-components", "./components"]
}
```

## 导出标签

想要让你项目中的标签用于其他项目，请在项目根目录的`marko.json`中定义公共标签
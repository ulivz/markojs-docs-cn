const langs = [
    {title: '简体中文', path: '/home', matchPath: /^\/zh-Hans/},
    {title: 'English', path: 'http://markojs.com/docs/getting-started/'},
]

const TOC =`
- [基础]()
  - [安装](/zh_cn/installing)
  - [快速上手](/zh_cn/getting-started)
  - [渲染](/zh_cn/rendering)
  - [语法](/zh_cn/syntax)
  - [核心指令](/zh_cn/core-tags)
  - [自定义指令](/zh_cn/custom-tags)
  - [组件](/zh_cn/components)
  - [服务端渲染](/zh_cn/server-side-rendering)
- [打包集成]()
  - [Lasso](/zh_cn/lasso)
  - [Webpack](/zh_cn/webpack)
  - [browserify](/zh_cn/browserify)
  - [rollup](/zh_cn/rollup)
- [服务端集成]()
  - [Express](/zh_cn/express)
  - [Koa](/zh_cn/koa)
  - [Hapi](/zh_cn/hapi)
  - [HTTP](/zh_cn/http)  
  - [Other](/zh_cn/huncwot)  
- [工具]()
  - [编辑器插件](/zh_cn/editor-plugins)
- [指南]()
  - [Color Picker](/zh_cn/color-picker) 
- [文章]()
  - [对比React](/zh_cn/marko-vs-react)    
  - [为什么Marko快?](/zh_cn/why-is-marko-fast)    
`

docute.init({
    landing: 'landing.html',
    // announcement(route) {
    //     const info = { type: 'success' }
    //     if (/\/zh-.+$/.test(route.path)) {
    //         info.html = '<a style="margin-right:10px;" class="docute-button docute-button-mini docute-button-success" href="https://github.com/egoist/donate" target="_blank">捐赠!</a> 通过 Patron 或者一次性捐赠支持 Docute 的开发。'
    //     } else {
    //         info.html = '<a style="margin-right:10px;" class="docute-button docute-button-mini docute-button-success" href="https://github.com/egoist/donate" target="_blank">Donate!</a> Support Docute development by becoming a patron or one-time donation.'
    //     }
    //     return info
    // },
    debug: true,
    // home: 'https://raw.githubusercontent.com/egoist/docute/master/README.md',
    repo: 'marko-js/marko',
    // twitter: 'rem_rin_rin',
    // 'edit-link': 'https://github.com/egoist/docute/blob/master/docs/',
    tocVisibleDepth: 3,
    toc: TOC,
    nav: {
        default: [
            {
                title: '主页', path: '/home'
            },
            {
                title: '在线工具', path: 'http://markojs.com/try-online'
            },
            {
                title: '编辑器插件',
                path: '/changelog',
                source: 'https://raw.githubusercontent.com/egoist/docute/master/CHANGELOG.md'
            },
            {
                title: '语言', type: 'dropdown', items: langs
            }
        ]
    },
    icons: [
        {
            label: '关注我的微博',
            svgId: 'i-weibo',
            svgClass: 'weibo-icon',
            link: 'http://weibo.com/zengxinyu'
        }
    ],
    plugins: [
        docsearch({
            apiKey: '65360cf9a91d87cd455d2b286d0d89ee',
            indexName: 'docute',
            tags: ['english', 'zh-Hans', 'zh-Hant', 'ja'],
            url: 'https://docute.js.org'
        }),
        evanyou()
    ]
})
# 说明

让vux能在vue-cli3上愉快的玩耍，不BB，看下面的配置使用

## 使用配置

> 特别说明，为了实现按需加载，请安装配套的[babel-plugin-vux-cli3](https://github.com/AresBug/babel-plugin-vux-cli3)插件，还有确保项目中已经安装了`less`和`less-loader`

- 安装vux-cli3-loader、babel-plugin-vux-cli3

``` bash
$ npm install vux-cli3-loader babel-plugin-vux-cli3 -D
```

- 配置`vux.config.js`

```js
const webpack = require('webpack')
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
        .use('vux-cli3-loader')
          .loader('vux-cli3-loader')
          .before('vue-loader')
  },
  configureWebpack: config => {
    config.plugins.push(new webpack.DefinePlugin({
      V_LOCALE: JSON.stringify('zh-CN'),
      V_SSR: JSON.stringify(false),
      SUPPORT_SSR_TAG: JSON.stringify(false)
    }))
    config.performance = {
      hints: false
    }
  }
}
```

- 配置`babel.config.js`

```js
module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
    "vux-cli3"
  ]
}
```

## 示例

如配置存在问题，请看这个[demo-vux-cli3](https://github.com/AresBug/demo-vux-cli3)设置

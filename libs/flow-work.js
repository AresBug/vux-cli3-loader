const path = require('path')
const fs = require('fs')
const parseVirtualComponent = require('./parse-virtual-component')
const getTagUtils = require('./getTag')

/* 处理x-icon */
exports.xIconWork = (source, filename) => {
  if (source.indexOf('<x-icon') > -1) {
    source = parseVirtualComponent(source, 'x-icon', function (query) {
      let size = query.objectList.size || 24
      let type = query.objectList.type
      let svgPath = path.resolve(process.cwd(), `node_modules/${filename}/src/icons/${type}.svg`)
  
      // merge classname
      let className = `vux-x-icon vux-x-icon-${type}`
      if (query.objectList.class) {
        className += ` ${query.objectList.class}`
      }
  
      let props = ''
      for (let i in query.objectList) {
        if (i !== 'class') {
          props += ` ${i}="${query.objectList[i]}"`
        }
      }
  
      const content = fs.readFileSync(svgPath, 'utf-8')
      return content.replace('width="512"', `width="${size}"`)
      .replace('height="512"', `height="${size}"`)
      .replace('<svg', `<svg class="${className}" ${props}`)
    })
  }
  return source
}

/* 处理ssr */
exports.ssrWork = (source) => {
  source = getTagUtils.removeTagCode(source, 'v-ssr')
  source = getTagUtils.reserveTagCode(source, 'v-no-ssr')
  return source
}

/* 处理i18n */
exports.i18nWork = (source, resourcePath, vuxCli3Locales) => {
  if (source.indexOf("$t(") > -1) {
    let locale = 'zh-CN'
    let name = resourcePath.replace(/\\/g, '/').split('components')[1].replace('index.vue', '').replace(/\//g, '')
    source = source.replace(/\$t\('?(.*?)'?\)/g, function (a, b) {
      let key = `vux.${name}.${b}`
      if (a.indexOf("'") > -1) {
        return "'" + vuxCli3Locales[locale][key] + "'"
      } else {
        return b
      }
    })
  }
  source = source.replace(/import.*\?vue&type=custom.*blockType=i18n\S\s.*\(component\)/g, '')
  return source
}

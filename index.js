'use strict';

const fs = require('fs')
const path = require('path')
const yaml = require('js-yaml')
const flowWork = require('./libs/flow-work')

Object.defineProperty(exports, "__esModule", {
  value: true
});

function vuxCli3Loader(source) {
  const filename = this.query && this.query.filename ? this.query.filename : 'vux'
  let sep = path.sep
  if (!global.vuxCli3Locales) {
    const localesPath = `${require.resolve(filename).split(`${sep}${filename}${sep}`)[0]}${sep}${filename}${sep}src${sep}locales${sep}all.yml`
    global.vuxCli3Locales = fs.existsSync(localesPath) ? yaml.safeLoad(fs.readFileSync(localesPath, 'utf-8')) : {}
  }

  source = flowWork.xIconWork(source, filename)
  let isVuxVueFile = this.resourcePath.replace(/\\/g, '/').indexOf(filename + '/src/components') > -1
  if (isVuxVueFile) {
    source = flowWork.ssrWork(source)
    source = flowWork.i18nWork(source, this.resourcePath, global.vuxCli3Locales)
  }
  return source
}

exports.default = vuxCli3Loader;

'use strict'

const path = require('path')
const Vue = require('vue')
const vueSSR = require('vue-server-renderer')

const requireFromString = require('require-from-string')

const ENGINE = {
  config: {
    layout: 'layout',
    clientManifest: path.resolve(__dirname, 'workspace/public/vue-ssr-client-manifest.json')
  },
  extensions: ['.vue', '.html'],
  handle: 'vuejs'
}

const clientManifest = require(ENGINE.config.clientManifest)

module.exports = () => {
  const fs = require('fs')
  const path = require('path')

  const debug = require('debug')('web:templates:vuejs')

  const VueJS = function (options) {
    debug('Starting vuejs templates engine...')

    this.config = options.config
    this.helpers = []
    this.pagesPath = options.pagesPath
    this.templates = {}
    this.additionalTemplates = options.additionalTemplates
    this.templateFuncs = {}

    this._loadAdditionalTemplates()
  }

  VueJS.prototype._loadAdditionalTemplates = function () {  
    this.additionalTemplates.forEach(file => {
      this.templateFuncs[path.parse(file).name] = fs.readFileSync(file, 'utf8')
    })
  }

  /**
    * Returns the engine core module.
    *
    * @return {function} The engine core module.
    */
  VueJS.prototype.getCore = function () {
    return vuejs
  }

  /**
    * Returns information about the engine.
    *
    * @return {object} An object containing the engine name and version.
    */
  VueJS.prototype.getInfo = function () {
    return {
      engine: ENGINE.handle
    }
  }

  /**
    * Initialises the engine.
    *
    * @return {Promise} A Promise that resolves when the engine is fully loaded.
    */
  VueJS.prototype.initialise = function () {
    this._loadAdditionalTemplates()

    debug('vuejs templates initialised')
  }

  /**
    * Registers the template with markup.
    *
    * @return Loaded template data.
    */
  VueJS.prototype.register = function (name, data) {
    return this.templates[name] = data
  }

  /**
    * Renders a template.
    *
    * @param {string} name The name of the template.
    * @param {string} data The template content.
    * @param {object} locals The variables to add to the context.
    * @param {object} options Additional render options.
    *
    * @return {Promise} A Promise that resolves with the render result.
    */
  VueJS.prototype.render = function (name, data, locals, options) {
    let vueobj = requireFromString(data.split('<script>').pop().split('</script>')[0])

    vueobj.template = data.split('<template>').pop().split('</template>')[0].trim()

    const app = new Vue(vueobj)

    const renderer = vueSSR.createRenderer({
      template: this.templateFuncs[ENGINE.config.layout],
      clientManifest
    })

    return new Promise((resolve, reject) => {
      renderer.renderToString(app, locals, (err, html) => {
        if (err) {
          throw err
          return reject({
            name: 'web-vuejs-templates',
            message: 'Error rendering template: ' + name,
            stack: err
          })
        }

        resolve(html)
      })
    })
  }

  return VueJS
}

module.exports.metadata = ENGINE

module.exports = {
  loadPlugin() {
    this.app.logger.silly('Start loading plugins', 'Core', 'Plugin')

    const plugins = this.config.plugins
    if (!Array.isArray(plugins)) {
      return
    }

    for(const plugin of plugins) {
      let filePath = this.resolveModule('plugin', plugin)
      const pluginConfig = this.config[plugin]

      if(filePath.path) {
        this.attachModuleToApp([filePath], 'plugin', {
          inject: {
            app: this.app,
            param: pluginConfig
          }
        })
        continue
      }

      filePath = require.resolve(plugin)

      if(filePath) {
        this.attachModuleToApp([{path:filePath, name: plugin}], 'plugin', {
          inject: pluginConfig
        })
        continue
      }

      throw Error(`Plugin<${plugin}> could not be found`)
    }

  }
}

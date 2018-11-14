const mergeWith = require('lodash.mergewith')

const cleanUpConfig = (config) => {
  return config
}

module.exports = {

  loadConfig() {
    let target = {}
    const configFilenames = [
      'config.default',
      `config.${this.env}`
    ]

    for(const filename of configFilenames) {
      const filePath = this.resolveModule('config', filename)

      if(!filePath.path) {
        continue
      }

      const config = require(filePath.path);
      target = cleanUpConfig(mergeWith(target, config, (obj, src) => {
        if(Array.isArray(obj)) return obj.concat(src)
      }))
    }

    this.config = this.app.config = target
  }
}

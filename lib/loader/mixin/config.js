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
      target = cleanUpConfig(mergeWith(target, config))
    }

    this.config = this.app.config = target
  }
}

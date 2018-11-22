module.exports = {
  loadService() {
    this.app.logger.silly('Start loading services', 'Core', 'Service')
    const filePath = this.resolveModule('service')
    this.attachModuleToApp(filePath, 'service', {
      inject: this.app
    })
  }
}

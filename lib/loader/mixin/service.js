module.exports = {
  loadService() {
    this.app.logger.silly('load services')
    const filePath = this.resolveModule('service')
    this.attachModuleToApp(filePath, 'service', {
      inject: this.app
    })
  }
}

module.exports = {
  loadController() {
    this.app.logger.silly('load controller')
    const filePath = this.resolveModule('controller')
    this.attachModuleToApp(filePath, 'controller', {
      inject: this.app
    })
  }
}

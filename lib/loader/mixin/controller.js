module.exports = {
  loadController() {
    this.app.logger.silly('Start loading controller...', 'Core', 'Controller')
    const filePath = this.resolveModule('controller')
    this.attachModuleToApp(filePath, 'controller', {
      inject: this.app
    })
  }
}

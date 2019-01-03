module.exports = {
  loadSubscriber() {
    this.app.logger.silly('Start loading Subscriber', 'Core', 'Subscriber')
    const subscribers = this.resolveModule('subscriber')
    this.attachModuleToApp(subscribers, 'subscriber', {
      inject: this.app
    })

  }
}

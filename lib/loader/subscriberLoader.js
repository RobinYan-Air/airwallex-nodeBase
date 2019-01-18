class Subscriber {
  constructor(sub, app, options) {
    this.sub = sub
    this.app = app
    this.options = options
  }

  load() {
    const { level, options, subscriber } = this.sub
    if (!this.app.plugin[level]) {
      this.app.logger.error(`Plugin<${level}> does not exist`)
      return
    }
    if (typeof this.app.plugin[level]['addSubscriber'] !== 'function') {
      this.app.logger.error(`Plugin<${level}> has no function named as 'addSubscriber'`)
      return
    }

    const callback = (args) => subscriber(args, this.app)

    this.app.event.on(level, () => {
      this.app.logger.silly(`Attach Subscriber for ${level}`, 'Core', 'Subscriber')

      this.app.plugin[level]['addSubscriber'](callback, options)
    })
    return callback
  }

}

module.exports = Subscriber

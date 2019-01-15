const lifecycle = [
  {
    name: 'onAppStart',
    event: 'SEVER_START',
    method: 'once'
  }, {
    name: 'onAppError',
    event: 'SEVER_ERROR',
    method: 'on'
  }, {
    name: 'onAppClose',
    event: 'SEVER_CLOSE',
    method: 'once'
  }
]

module.exports = {
  attachSystemEvent() {
    this.app.logger.silly('Start attaching SystemEvent', 'Core', 'SystemEvent')
    
    const plugins = this.app.plugin

    for(let key in plugins) {
      const plugin = plugins[key]

      lifecycle.forEach((lc) => {
        if(plugin[lc.name] && typeof plugin[lc.name] === 'function') {
          this.app.logger.silly(`Attach plugin<${key}> to Event<${lc.name}>`, 'Core', 'SystemEvent')
          this.app.event[lc.method](lc.event, () => {
            plugin[lc.name](this.app)
          })
        }
      })      
    }
  }
}

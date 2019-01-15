module.exports = {
  loadRouter() {
    const filePath = this.resolveModule('router')

    for(const { path, name } of filePath) {
      const router = require(path)
      router({...this.app, router: this.app.router(name)})

    }
  }
}

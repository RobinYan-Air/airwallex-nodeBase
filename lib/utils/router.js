const KoaRouter = require('koa-router')

const convertMiddlewares = (middlewares, app)  => middlewares.map((ctrl) => ((ctx, next) => {
  return ctrl.call(app, ctx, next)
}))

class Router extends KoaRouter {
  constructor(opts, app) {
    super(opts);
    this.app = app;

    this.generateKoaRouter();
  }

  generateKoaRouter() {

  }

  register(path, methods, middlewares, opts) {
    // patch register to support generator function middleware and string controller
    middlewares = Array.isArray(middlewares) ? middlewares : [ middlewares ];
    middlewares = convertMiddlewares(middlewares, this.app);
    path = Array.isArray(path) ? path : [ path ];
    path.forEach(p => super.register(p, methods, middlewares, opts));
    return this;
  }
}

module.exports = Router

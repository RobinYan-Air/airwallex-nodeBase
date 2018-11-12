const KoaRouter = require('koa-router')

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
function convertMiddlewares(middlewares, app) {
  const controller = middlewares.pop()
  const wrappedController = (ctx, next) => {
    return controller.call(app, ctx, next)
  };
  return middlewares.concat([ wrappedController ]);
}
module.exports = Router

const winston = require('winston')
const mergeWith = require('lodash.mergewith')
require('winston-daily-rotate-file')

const FUNSEE_LOGGER = Symbol('funsee#logger')
const FUNSEE_CONFIG = Symbol('funsee#config')

const errorLevel = ['silly', 'debug', 'verbose', 'warn', 'error', 'info']
const defaultConfig = {
  info: 'console'
}

const defaultTimeStamp = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
};

const defaultFormatter = (info) => `${defaultTimeStamp()} [${info.level}] ${info.message}`

const transTransportsFromObject = (key, obj) => {
  switch (obj.type) {
    case 'DailyRotateFile':
    default:
      const { path, filename } = obj
      return  new (winston.transports.DailyRotateFile)({
        dirname: path || '/var/log/',
        filename: `${filename || 'airwallex'}-%DATE%.log`,
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxFiles: '14d'
      })
  }

}

const transTransportsFromString = (key, value) => (value === 'console' ?
  new (winston.transports.Console)({
    name: `${key}_${value}`,
    level: key,
    handleExceptions: key === 'error',
    // timestamp: defaultTimeStamp,
    // formatter: defaultFormatter
    format: winston.format.printf(defaultFormatter)
  })
  :
  new (winston.transports.File)({
    name: `${key}_${value}`,
    filename: value,
    level: key,
    handleExceptions: key === 'error',
    json: false,
    // timestamp: defaultTimeStamp,
    // formatter: defaultFormatter
    format: winston.format.printf(defaultFormatter)
  }))

const transTransports = (key, value) => {
  if(!value) return
  switch (typeof value) {
    case 'string':
      return transTransportsFromString(key, value)
    case 'object':
      return transTransportsFromObject(key, obj)
    default:
      throw Error(`Logger Level<${key}> is wrong, please kindly check`)
  }
}

const generateTransport = (config) =>
    errorLevel.map((errLevel) => transTransports(errLevel, config[errLevel])).filter(value => value)

class Logger {
  constructor(app) {
    this.app = app

    this[FUNSEE_CONFIG] = this.app.config.logger ? mergeWith(defaultConfig, this.app.config.logger) : defaultConfig

    const transports = generateTransport(this[FUNSEE_CONFIG])
    this[FUNSEE_LOGGER] = winston.createLogger({
      transports
    })
  }
}

for (const level of errorLevel) {
  Object.assign(Logger.prototype, {
    [level](str, moduleName, functionName) {
      let message = JSON.stringify(str)
      message = functionName ? `<${functionName}> ${message}`: message
      message = moduleName ? `${moduleName} ${message}`: message
      message = this.app.traceId ? `🐞${this.app.traceId}🐞 ${message}` : message
      this[FUNSEE_LOGGER][level](message)
    }
  });
}

module.exports = Logger

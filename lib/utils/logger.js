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
  const date = new Date()
  // return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}T${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  return date.toISOString()
};

const defaultFormatter = (info) => `${defaultTimeStamp()} [${info.level}] ${info.message}`

const transTransportsFromObject = (key, obj) => {
  switch (obj.type) {
    case 'SizeRotateFile': {
      const { path, filename, maxsize, maxFiles, zippedArchive } = obj
      return new winston.transports.File({
        level: key,
        filename: `${path || '/var/log'}/${filename || 'airwallex'}.log`,
        maxsize: `${maxsize || 1024 * 1024 * 100}`,
        zippedArchive: !!zippedArchive,
        handleExceptions: key === 'error',
        format: winston.format.printf(defaultFormatter),
        maxFiles: `${maxFiles || 10}`
      })
    }
    case 'DailyRotateFile':
    default: {
      const { path, filename, maxFiles, datePattern, zippedArchive } = obj
      return  new (winston.transports.DailyRotateFile)({
        level: key,
        dirname: path || '/var/log/',
        filename: `${filename || 'airwallex'}-%DATE%.log`,
        datePattern: datePattern || 'YYYY-MM-DD',
        handleExceptions: key === 'error',
        zippedArchive: !!zippedArchive,
        format: winston.format.printf(defaultFormatter),
        maxFiles: maxFiles || '14d'
      })
    }
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

  if(Array.isArray(value)) {
    return value.map((v) => transTransports(key, v))
  }

  switch (typeof value) {
    case 'string':
      return transTransportsFromString(key, value)
    case 'object':
      return transTransportsFromObject(key, value)
    default:
      throw Error(`Logger Level<${key}> is wrong, please kindly check`)
  }
}

const generateTransport = (config) =>
  errorLevel.reduce((acc, errLevel) => (acc.concat(transTransports(errLevel, config[errLevel]))), []).filter(value => value)

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

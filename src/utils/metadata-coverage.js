const debug = require('debug')('qdx')
const _ = require('lodash')

const describeResult = require('./metadata.json')

function getType(folder) {
  const result = _.find(describeResult.metadataObjects, {directoryName: folder})
  if (result) return result.xmlName
}

module.exports = {getType}

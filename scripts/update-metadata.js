const fs = require('fs')
const _ = require('lodash')

const describeResult1 = require('../src/utils/metadata.json')
const describeResult2 = require('../src/utils/temp-metadata.json')

for (let metadaDescribe of describeResult2.result.metadataObjects) {
  describeResult1.metadataObjects.push(metadaDescribe)
}
function compare(a, b) {
  if (a.xmlName < b.xmlName) {
    return -1
  }
  if (a.xmlName > b.xmlName) {
    return 1
  }
  return 0
}

describeResult1.metadataObjects.sort(compare)
describeResult1.metadataObjects = _.uniqWith(describeResult1.metadataObjects, _.isEqual)

fs.writeFileSync(
  '../src/utils/metadata2.json',
  JSON.stringify(describeResult1, null, 4),
  {encoding: 'utf-8'})


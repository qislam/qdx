const debug = require('debug')('qdx')
const _ = require('lodash')

const describeResult = require('./metadata.json')

function getType(folder) {
  const result = _.find(describeResult.metadataObjects, {directoryName: folder})
  if (result) return result.xmlName
}

function updateYaml(filePathList, yamlBody, projectPath) {
  for (let filePath of filePathList) {
    debug('filePath: ' + filePath)
    if (!filePath.startsWith(projectPath)) continue
    let pathParts = filePath.replace(projectPath + '/', '').split('/')

    let folder = pathParts.shift()
    let metadataName = pathParts.pop().replace(/\.[\w]+$|\.[\w]+-meta\.xml$/, '')
    let metadataType = getType(folder) || folder

    if (folder === 'objects') {
      let sobject = pathParts.shift()
      if (pathParts.length > 0) {
        metadataName = sobject + '.' + metadataName
        let subfolder = pathParts.shift()
        if (subfolder === 'fields') metadataType = 'CustomField'
        if (subfolder === 'recordTypes') metadataType = 'RecordType'
        if (subfolder === 'compactLayouts') metadataType = 'CompactLayout'
        if (subfolder === 'webLinks') metadataType = 'WebLink'
        if (subfolder === 'listViews') metadataType = 'ListView'
        if (subfolder === 'validationRules') metadataType = 'ValidationRule'
      }
    } else if (pathParts.length > 0) {
      let subfolder = pathParts.shift()
      metadataName = subfolder + '/' + metadataName
    } else if (folder === 'documents') {
      metadataType = 'DocumentFolder'
    } else if (folder === 'email') {
      metadataType = 'EmailFolder'
    } else if (folder === 'reports') {
      metadataType = 'ReportFolder'
    } else if (folder === 'dashboards') {
      metadataType = 'DashboardFolder'
    }

    debug(metadataType + ':' + metadataName)

    if (!yamlBody[metadataType]) yamlBody[metadataType] = []
    yamlBody[metadataType].push(metadataName)
  }

  for (let key in yamlBody) {
    if (key === 'ManualSteps' || key === 'Version') continue
    yamlBody[key] = _.uniqWith(yamlBody[key], _.isEqual)
    yamlBody[key].sort()
  }
}

module.exports = {getType, updateYaml}

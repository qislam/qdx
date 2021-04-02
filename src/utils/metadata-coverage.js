const debug = require('debug')('qdx')
const {cli} = require('cli-ux')
const _ = require('lodash')

const describeResult = require('./metadata.json')

function getType(folder) {
  const result = _.find(describeResult.metadataObjects, {directoryName: folder})
  if (result) return result.xmlName
}

function getTypeByExtension(extension) {
  const result = _.find(describeResult.metadataObjects, {suffix: extension})
  if (result) return result.xmlName
}

function getDirByExtension(extension) {
  const result = _.find(describeResult.metadataObjects, {suffix: extension})
  if (result) return result.directoryName
}

function updateYaml(filePathList, yamlBody) {
  const objectSubTypes = _.find(describeResult.metadataObjects, {xmlName: 'CustomObject'}).childXmlNames
  const metaDataRequireFolder = [
    'EmailTemplate',
    'Document',
    'Report',
    'Dashboard',
  ]

  for (let filePath of filePathList) {
    let metadataName = ''
    let metadataType = ''
    let folder = ''
    let parentFolder = ''

    debug('filePath: ' + filePath)

    let pathParts = filePath.split('/')
    let fileNameParts = pathParts.pop().replace(/-meta\.xml$/, '').split(/\.(?=[^.]+$)/)
    debug('fileNameParts:\n' + JSON.stringify(fileNameParts, null, 4))

    metadataName = fileNameParts[0]
    debug('metadataName: ' + metadataName)
    const fileExtension = fileNameParts[1]
    debug('fileExtension: ' + fileExtension)

    metadataType = getTypeByExtension(fileExtension)
    debug('metadataType: ' + metadataType)

    debug('pathParts:\n' + JSON.stringify(pathParts, null, 4))

    if (pathParts.length > 0) folder = pathParts.pop()
    debug('folder: ' + folder)

    if (!metadataType) {
      switch (folder) {
        case 'fields':
          metadataType = 'CustomField'
          break
        case 'recordTypes':
          metadataType = 'RecordType'
          break
        case 'compactLayouts':
          metadataType = 'CompactLayout'
          break
        case 'webLinks':
          metadataType = 'WebLink'
          break
        case 'listViews':
          metadataType = 'ListView'
          break
        case 'validationRules':
          metadataType = 'ValidationRule'
      }
    }

    if (!metadataType) metadataType = getType(folder)
    if (pathParts.length > 0) parentFolder = pathParts.pop()
    if (!metadataType) metadataType = getType(parentFolder)

    if (folder && metadataType && metaDataRequireFolder.includes(metadataType)) {
      metadataName = folder + '/' + metadataName
    }
    debug('metadataName: ' + metadataName)

    if (metadataType && parentFolder && objectSubTypes.includes(metadataType)) {
      metadataName = parentFolder + '.' + metadataName
    }

    if (!metadataType) continue
    if (!yamlBody[metadataType]) yamlBody[metadataType] = []
    yamlBody[metadataType].push(metadataName)
  }
}

function updateYaml2(filePathList, yamlBody, projectPath) {
  for (let filePath of filePathList) {
    debug('filePath: ' + filePath)
    if (!filePath || !filePath.startsWith(projectPath)) continue
    let pathParts = filePath.replace(projectPath + '/', '').split('/')
    if (pathParts.length < 2) continue

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
}

module.exports = {getType, updateYaml, updateYaml2}

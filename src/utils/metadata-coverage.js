const debug = require('debug')('qdx')
const path = require('path')
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

function updateYaml(filePathList, yamlBody, projectpath) {
  const objectSubTypes = _.find(describeResult.metadataObjects, {xmlName: 'CustomObject'}).childXmlNames
  const metaDataRequireFolder = [
    'EmailTemplate',
    'Document',
    'Report',
    'Dashboard',
  ]

  for (let filePath of filePathList) {
    debug('filePath: ' + filePath)
    debug('projectpath: ' + projectpath)
    
    if (projectpath && !filePath.includes(projectpath)) continue
    let metadataName = ''
    let metadataType = ''
    let folder = ''
    let parentFolder = ''

    let pathParts = filePath.split(path.sep)
    if (pathParts.length < 2) pathParts = filePath.split('/')
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

    if (folder !== 'staticresources' && ['js', 'css', 'design'].includes(fileExtension)) {
      metadataName = folder
    }

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

module.exports = {describeResult, getType, updateYaml}

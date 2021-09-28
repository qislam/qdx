const {Command, flags, args} = require('@oclif/command')
const {cli} = require('cli-ux')
const debug = require('debug')('qdx')
const path = require('path')
const fs = require('fs')
const YAML = require('yaml')
const csvjson = require('csvjson')
const xmljs = require('xml-js')
const execa = require('execa')
const _ = require('lodash')

const {updateYaml} = require('../utils/metadata-coverage')
const {yaml2xml} = require('../utils/convert')
const {getAbsolutePath, getFiles, getTimeStamp} = require('../utils/util')

class PackageCommand extends Command {
  async run() {
    this.log(getTimeStamp() + '\tSTART')
    const {flags, args} = this.parse(PackageCommand)
    debug('args: ' + JSON.stringify(args, null, 4))
    debug('flags: ' + JSON.stringify(flags, null, 4))
    cli.action.start('Started on package ' + args.packageName)

    const yamlPath = `manifest/${args.packageName.replace('/', '-')}.yml`
    const projectpath = flags.projectpath || 'force-app/main/default'
    debug('projectpath: ' + projectpath)
    let apiVersion = flags.version || '52.0'

    const objectSubtypes = [
      'CustomField',
      'Index',
      'BusinessProcess',
      'RecordType',
      'CompactLayout',
      'WebLink',
      'ValidationRule',
      'SharingReason',
      'ListView',
      'FieldSet',
    ]

    if (flags.start || !fs.existsSync(yamlPath)) {
      this.log(getTimeStamp() + '\tSetting up new package. STARTED')
      if (!fs.existsSync('manifest')) {
        debug('Creating manifest dir')
        fs.mkdirSync('manifest')
      }
      debug('Starting blank package YAML file.')
      fs.writeFileSync(
        yamlPath,
        YAML.stringify({Version: apiVersion}),
        {encoding: 'utf-8'}
      )
      this.log(getTimeStamp() + '\tSetting up new package. COMPLETED')
    }

    const yamlBody = YAML.parse(fs.readFileSync(yamlPath, 'utf-8')) || {}
    if (yamlBody.Version) apiVersion = yamlBody.Version
    debug('yamlBody: \n' + JSON.stringify(yamlBody, null, 4))

    if (flags.yaml) {
      this.log('Preparing metadata list from yaml. STARTED')
      if (!flags.path) {
        cli.action.stop('File not not provided. Must be relative to current directory')
      }
      if (!fs.existsSync(getAbsolutePath(flags.path))) {
        cli.action.stop('File not found. Check file path. Must be relative to current directory')
      }

      const sourceYaml = YAML.parse(fs.readFileSync(flags.path, 'utf-8'))
      for (let key in sourceYaml) {
        if (!{}.hasOwnProperty.call(sourceYaml, key)) continue
        if (!yamlBody[key]) yamlBody[key] = []
        switch (key) {
          case 'Version':
            yamlBody[key] = sourceYaml[key]
            break
          case undefined:
            yamlBody[key] = sourceYaml[key]
            break
          default:
            yamlBody[key] = [...yamlBody[key], ...sourceYaml[key]]
        }
      }
      this.log(getTimeStamp() + '\tPreparing metadata list from yaml. COMPLETED')
    }

    if (flags.xml) {
      this.log('Preparing metadata list from xml. STARTED')
      if (!flags.path) {
        cli.action.stop('File not not provided. Must be relative to current directory')
      }
      if (!fs.existsSync(getAbsolutePath(flags.path))) {
        cli.action.stop('File not found. Check file path. Must be relative to current directory')
      }
      const xmlBody = fs.readFileSync(flags.path, 'utf-8')
      this.log(xmljs.xml2json(xmlBody, {compact: true, spaces: 4}))
      this.log(xmljs.xml2json(xmlBody, {compact: false, spaces: 4}))

      this.log(getTimeStamp() + '\tPreparing metadata list from xml. COMPLETED')
    }

    if (flags.diff) {
      this.log(getTimeStamp() + '\tPreparing metadata list from diff. STARTED')
      if (!args.commit1 || !args.commit2) {
        cli.action.stop('Commit hashes are required with diff flag.')
      }
      const diffResult = await execa('git', ['diff', '--name-only', args.commit1, args.commit2])
      const diffPaths = diffResult.stdout.split('\n')
      debug('diffPaths: \n' + JSON.stringify(diffPaths, null, 4))
      try {
        updateYaml(diffPaths, yamlBody, projectpath)
      } catch (error) {
        cli.action.stop('Error: ' + error)
        return
      }
      this.log(getTimeStamp() + '\tPreparing metadata list from diff. COMPLETED')
    }

    if (flags.dir) {
      this.log(getTimeStamp() + '\tPreparing metadata list from dir. STARTED')
      if (!flags.projectpath) {
        cli.action.stop('Project path is required.')
        return
      }
      const fullProjectPath = path.join(process.cwd(), ...projectpath.split('/'))
      debug('fullProjectPath: ' + fullProjectPath)
      const filePaths = await getFiles(fullProjectPath)
      debug('filePaths: ' + filePaths.length)
      let osProjPath = projectpath
      if (path.sep !== '/') {
        osProjPath = projectpath.replace(/\//g, path.sep)
      }
      try {
        updateYaml(filePaths, yamlBody, osProjPath)
      } catch (error) {
        cli.action.stop('Error: ' + error)
        return
      }
      this.log(getTimeStamp() + '\tPreparing metadata list from dir. COMPLETED')
    }

    if (flags.csv) {
      this.log(getTimeStamp() + '\tPreparing metadata list from csv. STARTED')
      if (!flags.path) {
        cli.action.stop('File not not provided. Must be relative to current directory')
        return
      }
      if (!fs.existsSync(getAbsolutePath(flags.path))) {
        cli.action.stop('File not found. Check file path. Must be relative to current directory')
      }
      let featureCSV = csvjson.toObject(fs.readFileSync(flags.path, 'utf-8'))
      debug('featureCSV first record: ' + JSON.stringify(featureCSV[0], null, 4))

      for (let metadataRecord of featureCSV) {
        debug('metadataRecord: ' + JSON.stringify(metadataRecord, null, 4))
        let metadataType = metadataRecord.MetadataType
        let metadataName = metadataRecord.MetadataName
        if (!yamlBody[metadataType]) yamlBody[metadataType] = []
        yamlBody[metadataType].push(metadataName)
        debug('featureYAML: ' + JSON.stringify(yamlBody, null, 4))
      }
      this.log(getTimeStamp() + '\tPreparing metadata list from csv. COMPLETED')
    }

    if (flags.full) {
      this.log(getTimeStamp() + '\tPreparing FULL metadata list from org. STARTED')
      if (!flags.username) cli.action.stop('Username must be provided')

      const fullDescribeCmd = `sfdx force:mdapi:describemetadata -u ${flags.username} --json`
      const {stdout} = execa.commandSync(fullDescribeCmd)
      for (const metadataObject of JSON.parse(stdout).result.metadataObjects) {
        const metadataType = metadataObject.xmlName
        if (!yamlBody[metadataType]) yamlBody[metadataType] = []
      }
      this.log(getTimeStamp() + '\tPreparing FULL metadata list from org. COMPLETED')
    }

    if (flags.full || flags.fill) {
      this.log(getTimeStamp() + '\tPreparing full metadata list for components listed in yaml. STARTED')
      if (!flags.username) cli.action.stop('Username must be provided')

      for (const metadataType in yamlBody) {
        if (!{}.hasOwnProperty.call(yamlBody, metadataType)) continue
        if (metadataType === 'Version') continue
        yamlBody[metadataType] = []

        const listmetadatCommand = `sfdx force:mdapi:listmetadata -m ${metadataType} -u ${flags.username} --json`

        let folderType = ''
        if (metadataType === 'EmailTemplate') folderType = 'EmailFolder'
        if (metadataType === 'Report') folderType = 'ReportFolder'
        if (metadataType === 'Document') folderType = 'DocumentFolder'
        if (metadataType === 'Dashboard') folderType = 'DashboardFolder'
        debug('folderType: ' + folderType)

        if (folderType) {
          const folderListCmd = `sfdx force:mdapi:listmetadata -m ${folderType} -u ${flags.username} --json`
          const {stdout} = execa.commandSync(folderListCmd)
          debug('FolderListResult:\n' + stdout)

          const metadataFolders = JSON.parse(stdout).result
          if (Array.isArray(metadataFolders)) {
            for (const metadataFolderName of metadataFolders) {
              if (metadataFolderName.fullName.startsWith('unfiled')) continue
              const cmdWithFolderName = `${listmetadatCommand} --folder ${metadataFolderName.fullName}`
              const {stdout} = execa.commandSync(cmdWithFolderName)
              debug('MetadataNames:\n' + stdout)
              const metadataNames = JSON.parse(stdout).result
              if (Array.isArray(metadataNames)) {
                for (const metadataName of metadataNames) {
                  if (!yamlBody[metadataType]) yamlBody[metadataType] = []
                  yamlBody[metadataType].push(metadataName.fullName)
                }
              }
            }
          }
        } else {
          const {stdout} = execa.commandSync(listmetadatCommand)
          debug('MetadataNames:\n' + stdout)
          const metadataNames = JSON.parse(stdout).result
          if (Array.isArray(metadataNames)) {
            for (const metadataName of metadataNames) {
              if (metadataName.namespacePrefix) continue
              if (!yamlBody[metadataType]) yamlBody[metadataType] = []
              yamlBody[metadataType].push(metadataName.fullName)
            }
          }
        }
      }
      this.log(getTimeStamp() + '\tPreparing full metadata list for components listed in yaml. COMPLETED')
    }

    this.log(getTimeStamp() + '\tSorting yaml. STARTED')

    for (let key in yamlBody) {
      if (key === 'ManualSteps' || key === 'Version') continue
      yamlBody[key] = _.uniqWith(yamlBody[key], _.isEqual)
      yamlBody[key].sort()
    }

    this.log(getTimeStamp() + '\tSorting yaml. COMPLETED')

    debug('yamlBody: ' + JSON.stringify(yamlBody, null, 4))

    this.log(getTimeStamp() + '\tWriting yaml file. STARTED')
    fs.writeFileSync(
      yamlPath,
      YAML.stringify(yamlBody),
      {encoding: 'utf-8'}
    )
    this.log(getTimeStamp() + '\tWriting yaml file. COMPLETED')

    this.log(getTimeStamp() + '\tPreparing/writing xml file. STARTED')
    let xmlBody = yaml2xml(yamlBody, apiVersion)
    let xmlOptions = {
      spaces: 4,
      compact: false,
      declerationKey: 'decleration',
      attributesKey: 'attributes',
    }
    fs.writeFileSync(
      yamlPath.replace(/yml$/i, 'xml'),
      xmljs.js2xml(xmlBody, xmlOptions),
      {encoding: 'utf-8'}
    )
    this.log(getTimeStamp() + '\tPreparing/writing xml file. COMPLETED')

    if (flags.retrieve || flags.delete) {
      this.log(getTimeStamp() + '\tRetrieving source from org. STARTED')
      if (!flags.username) cli.action.stop('Username must be provided')
      let retrieveCmd = 'sfdx force:source:retrieve -x ' + yamlPath.replace(/yml$/i, 'xml')
      if (flags.username) retrieveCmd += ' -u ' + flags.username
      const {stdout} = execa.commandSync(retrieveCmd)
      this.log(getTimeStamp() + '\tRetrieving source from org. COMPLETED')
    }

    if (flags.deploy) {
      this.log(getTimeStamp() + '\tDeploying source to org. STARTED')
      if (!flags.username) cli.action.stop('Username must be provided')
      let deployCmd = 'sfdx force:source:deploy -x ' + yamlPath.replace(/yml$/i, 'xml')
      if (flags.username) deployCmd += ' -u ' + flags.username
      if (flags.checkonly) deployCmd += ' --checkonly'
      const {stdout} = execa.commandSync(deployCmd)
      this.log(stdout)
      this.log(getTimeStamp() + '\tDeploying source to org. COMPLETED')
    }

    if (flags.delete) {
      this.log(getTimeStamp() + '\tDeleting components from org. STARTED')
      if (!flags.username) cli.action.stop('Username must be provided')
      let deleteCmd = ''

      for (let metadataType in yamlBody) {
        if (metadataType === 'ManualSteps' || metadataType === 'Version') continue

        if (Array.isArray(yamlBody[metadataType]) && yamlBody[metadataType].length > 0) {
          for (let metadataName of yamlBody[metadataType]) {
            if (objectSubtypes.includes(metadataType)) {
              const objectName = metadataName.split('.')[0]
              const subTypeName = metadataName.split('.')[1]
              let subTypeFolder
              let subtypeExtension

              if (metadataType === 'CustomField') {
                subTypeFolder = 'fields'
                subtypeExtension = 'field'
              } else if (metadataType === 'RecordType') {
                subTypeFolder = 'recordTypes'
                subtypeExtension = 'recordType'
              } else if (metadataType === 'CompactLayout') {
                subTypeFolder = 'compactLayouts'
                subtypeExtension = 'compactLayout'
              } else if (metadataType === 'WebLink') {
                subTypeFolder = 'webLinks'
                subtypeExtension = 'webLink'
              } else if (metadataType === 'ValidationRule') {
                subTypeFolder = 'validationRules'
                subtypeExtension = 'validationRule'
              } else if (metadataType === 'SharingReason') {
                subTypeFolder = 'sharingReasons'
                subtypeExtension = 'sharingReason'
              } else if (metadataType === 'ListView') {
                subTypeFolder = 'listViews'
                subtypeExtension = 'listView'
              } else if (metadataType === 'FieldSet') {
                subTypeFolder = 'fieldSets'
                subtypeExtension = 'fieldSet'
              } else if (metadataType === 'Index') {
                subTypeFolder = 'indexes'
                subtypeExtension = 'index'
              } else if (metadataType === 'BusinessProcess') {
                subTypeFolder = 'businessProcesses'
                subtypeExtension = 'businessProcess'
              }

              deleteCmd = `sfdx force:source:delete -u ${flags.username} -p ${flags.projectpath}/objects/${objectName}/${subTypeFolder}/${subTypeName}.${subtypeExtension}-meta.xml --noprompt`
            } else {
              deleteCmd = `sfdx force:source:delete -m ${metadataType}:${metadataName} -u ${flags.username} --noprompt`
            }
            debug('deleteCmd: ' + deleteCmd)
            const {stdout} = execa.commandSync(deleteCmd)
            this.log(stdout)
          }
        }
      }
      this.log(getTimeStamp() + '\tDeleting components from org. COMPLETED')
    }

    this.log(getTimeStamp() + '\tEND')
    cli.action.stop('done')
  }
}

PackageCommand.description = `To build a package to use with sfdx retrieve/deploy commands.
...
Extra documentation goes here
`

PackageCommand.flags = {
  help: flags.help({char: 'h'}),
  start: flags.boolean({char: 's', description: 'Start a new package. Will create YAML file if not already exist.'}),
  diff: flags.boolean({description: 'Build metadata components by running a diff.'}),
  dir: flags.boolean({description: 'Build metadata components based on directory contents.'}),
  csv: flags.boolean({description: 'Build metadata components based on a csv file.'}),
  yaml: flags.boolean({description: 'Build metadata components based on a yml file.'}),
  xml: flags.boolean({description: 'Build metadata components based on a xml file.'}),
  path: flags.string({char: 'p', description: 'Path to app directory or csv file.'}),
  version: flags.string({description: 'API version to use for SFDX'}),
  retrieve: flags.boolean({char: 'r', description: 'Retrieve source based on YAML configuration.'}),
  deploy: flags.boolean({char: 'd', description: 'Deploys source already retrieved.'}),
  delete: flags.boolean({description: 'Delete the specific components listed in the yaml file.'}),
  checkonly: flags.boolean({description: 'Set to true for deployment validation'}),
  projectpath: flags.string({description: 'Base path for the project code.'}),
  username: flags.string({char: 'u'}),
  fill: flags.boolean({description: 'Set to true to include all metadata for types listed in yaml.'}),
  full: flags.boolean({description: 'Set to true to get a complete list of all metadata available.'}),
  installedpackage: flags.boolean(),
}

PackageCommand.args = [
  {name: 'packageName', required: true},
  {name: 'commit1', required: false},
  {name: 'commit2', required: false},
]

module.exports = PackageCommand

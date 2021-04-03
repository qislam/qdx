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

const {updateYaml, updateYaml2} = require('../utils/metadata-coverage')
const {yaml2xml} = require('../utils/convert')
const {getAbsolutePath, getFiles} = require('../utils/util')

class PackageCommand extends Command {
  async run() {
    const {flags, args} = this.parse(PackageCommand)
    debug('args: ' + JSON.stringify(args, null, 4))
    debug('flags: ' + JSON.stringify(flags, null, 4))
    cli.action.start('Started on package ' + args.packageName)

    const yamlPath = `manifest/${args.packageName.replace('/', '-')}.yml`
    const projectPath = flags.projectPath || 'force-app/main/default'
    debug('projectPath: ' + projectPath)
    let apiVersion = flags.version || '50.0'

    if (flags.start || !fs.existsSync(yamlPath)) {
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
    }

    const yamlBody = YAML.parse(fs.readFileSync(yamlPath, 'utf-8')) || {}
    if (yamlBody.Version) apiVersion = yamlBody.Version
    debug('yamlBody: \n' + JSON.stringify(yamlBody, null, 4))

    if (flags.yaml) {
      if (!flags.path) {
        cli.action.stop('File not not provided. Must be relative to current directory')
      }
      if (!fs.existsSync(getAbsolutePath(flags.path))) {
        cli.action.stop('File not found. Check file path. Must be relative to current directory')
      }

      const sourceYaml = YAML.parse(fs.readFileSync(flags.path, 'utf-8'))
      for (let key in sourceYaml) {
        if ({}.hasOwnProperty.call(sourceYaml, key)) continue
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
    }

    if (flags.diff) {
      if (!args.commit1 || !args.commit2) {
        cli.action.stop('Commit hashes are required with diff flag.')
      }
      const diffResult = await execa('git', ['diff', '--name-only', args.commit1, args.commit2])
      const diffPaths = diffResult.stdout.split('\n')
      debug('diffPaths: \n' + JSON.stringify(diffPaths, null, 4))
      try {
        updateYaml(diffPaths, yamlBody, projectPath)
      } catch (error) {
        cli.action.stop('Error: ' + error)
      }
    }

    if (flags.dir) {
      if (!flags.projectPath) {
        cli.action.stop('Project path is required.')
      }
      const fullProjectPath = path.join(process.cwd(), ...projectPath.split('/'))
      debug('fullProjectPath: ' + fullProjectPath)
      const filePaths = await getFiles(fullProjectPath)
      try {
        updateYaml(filePaths, yamlBody)
      } catch (error) {
        cli.action.stop('Error: ' + error)
      }
    }

    if (flags.csv) {
      if (!flags.path) {
        cli.action.stop('File not not provided. Must be relative to current directory')
      }
      if (!fs.existsSync(getAbsolutePath(flags.path))) {
        cli.action.stop('File not found. Check file path. Must be relative to current directory')
      }
      let featureCSV = csvjson.toObject(fs.readFileSync(flags.path, 'utf-8'))
      debug('featureCSV first record: ' + JSON.stringify(featureCSV[0], null, 4))

      for (let metadataRecord of featureCSV) {
        debug('metadataRecord: ' + JSON.stringify(metadataRecord, null, 4))
        let metadatType = metadataRecord.MetadataType
        let metadatName = metadataRecord.MetadataName
        if (!yamlBody[metadatType]) yamlBody[metadatType] = []
        yamlBody[metadatType].push(metadatName)
        debug('featureYAML: ' + JSON.stringify(yamlBody, null, 4))
      }
    }

    for (let key in yamlBody) {
      if (key === 'ManualSteps' || key === 'Version') continue
      yamlBody[key] = _.uniqWith(yamlBody[key], _.isEqual)
      yamlBody[key].sort()
    }

    debug('yamlBody: ' + JSON.stringify(yamlBody, null, 4))

    fs.writeFileSync(
      yamlPath,
      YAML.stringify(yamlBody),
      {encoding: 'utf-8'}
    )

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

    if (flags.retrieve) {
      let retrieveCmd = 'sfdx force:source:retrieve -x ' + yamlPath.replace(/yml$/i, 'xml')
      if (flags.username) retrieveCmd += ' -u ' + flags.username
      const {stdout} = execa.commandSync(retrieveCmd)
      this.log(stdout)
    }

    if (flags.deploy) {
      let retrieveCmd = 'sfdx force:source:deploy -x ' + yamlPath.replace(/yml$/i, 'xml')
      if (flags.username) retrieveCmd += ' -u ' + flags.username
      if (flags.checkonly) retrieveCmd += ' --checkonly'
      const {stdout} = execa.commandSync(retrieveCmd).stdout.pipe(process.stdout)
      this.log(stdout)
    }

    cli.action.stop('completed processing')
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
  path: flags.string({char: 'p', description: 'Path to app directory or csv file.'}),
  version: flags.string({description: 'API version to use for SFDX'}),
  retrieve: flags.boolean({char: 'r', description: 'Retrieve source based on YAML configuration.'}),
  deploy: flags.boolean({char: 'd', description: 'Deploys source already retrieved.'}),
  checkonly: flags.boolean({description: 'Set to true for deployment validation'}),
  projectPath: flags.string({description: 'Base path for the project code.'}),
  username: flags.string({char: 'u'}),
  fill: flags.boolean({description: 'Set to true to include all metadata for types listed in yaml.'}),
  full: flags.boolean({description: 'Set to true to get a complete list of all metadata available.'}),
}

PackageCommand.args = [
  {name: 'packageName', required: true},
  {name: 'commit1', required: false},
  {name: 'commit2', required: false},
]

module.exports = PackageCommand

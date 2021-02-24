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

class PackageCommand extends Command {
  async run() {
    const {flags, args} = this.parse(PackageCommand)
    debug('args: ' + JSON.stringify(args, null, 4))
    debug('flags: ' + JSON.stringify(flags, null, 4))
    cli.action.start('Started on package ' + args.packageName)

    const yamlPath = `manifest/${args.packageName.replace('/', '-')}.yml`
    const projectPath = flags.projectPath || 'force-app/main/default'
    debug('projectPath: ' + projectPath)
    const apiVersion = flags.version || '50.0'

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
    debug('yamlBody: \n' + JSON.stringify(yamlBody, null, 4))

    if (flags.diff) {
      if (!args.commit1 || !args.commit2) {
        cli.action.stop('Commit hashes are required with diff flag.')
      }
      const diffResult = await execa('git', ['diff', '--name-only', args.commit1, args.commit2])
      const diffPaths = diffResult.stdout.split('\n')
      debug('diffPaths: \n' + JSON.stringify(diffPaths, null, 4))

      updateYaml(diffPaths, yamlBody, projectPath)

      debug('yamlBody: ' + JSON.stringify(yamlBody, null, 4))
    }

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
  path: flags.string({char: 'p', description: 'Path to app directory or csv file.'}),
  version: flags.string({description: 'API version to use for SFDX'}),
  retrieve: flags.boolean({char: 'r', description: 'Retrieve source based on YAML configuration.'}),
  deploy: flags.boolean({char: 'd', description: 'Deploys source already retrieved.'}),
  projectPath: flags.boolean({description: 'Base path for the project code.'}),
  username: flags.string({char: 'u'}),
}

PackageCommand.args = [
  {name: 'packageName', required: true},
  {name: 'commit1', required: false},
  {name: 'commit2', required: false},
]

module.exports = PackageCommand

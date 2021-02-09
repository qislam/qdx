const {Command, flags, args} = require('@oclif/command')
const {cli} = require('cli-ux')
const debug = require('debug')('qdx')
const path = require('path')
const fs = require('fs')
const YAML = require('yaml')
const sfdx = require('sfdx-node')
const csvjson = require('csvjson')
const xmljs = require('xml-js')
const execa = require('execa')
const _ = require('lodash')

class PackageCommand extends Command {
  async run() {
    const {flags, args} = this.parse(PackageCommand)
    debug('args: ' + JSON.stringify(args, null, 4))
    debug('flags: ' + JSON.stringify(flags, null, 4))
    cli.action.start('Started on package ' + args.packageName)

    if (flags.start || !fs.existsSync(`manifest/${args.packageName.replace('/', '-')}.yml`)) {
      if (!fs.existsSync('manifest')) {
        debug('Creating manifest dir')
        fs.mkdirSync('manifest')
      }
      debug('Starting blank package YAML file.')
      fs.writeFileSync(
        `manifest/${args.packageName.replace('/', '-')}.yml`,
        YAML.stringify({Version: flags.version || '50.0'}),
        {encoding: 'utf-8'}
      )
    }

    if (flags.diff) {
      if (!args.commit1 || !args.commit2) {
        cli.action.stop('Commit hashes are required with diff flag.')
      }
      const diffFiles = await execa('git', ['diff', '--name-only', args.commit1, args.commit2])
      debug('diffFiles: \n' + JSON.stringify(diffFiles, null, 4))
    }
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
  username: flags.string({char: 'u'}),
}

PackageCommand.args = [
  {name: 'packageName', required: true},
  {name: 'commit1', required: false},
  {name: 'commit2', required: false},
]

module.exports = PackageCommand

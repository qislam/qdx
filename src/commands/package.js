const {Command, flags, args} = require('@oclif/command')
const debug = require('debug')('qdx')
const path = require('path')
const fs = require('fs')
const YAML = require('yaml')
const sfdx = require('sfdx-node')
const csvjson = require('csvjson')
const xmljs = require('xml-js')
const _ = require('lodash')
const simpleGit = require('simple-git')
const git = simpleGit()

class PackageCommand extends Command {
  async run() {
    const {flags, args} = this.parse(PackageCommand)
    debug('args: ' + JSON.stringify(args, null, 4))
    debug('flags: ' + JSON.stringify(flags, null, 4))
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

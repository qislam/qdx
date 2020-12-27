const {Command, flags} = require('@oclif/command')
const debug = require('debug')('qdx:deploy')
const puppeteer = require('puppeteer')

class DeployCommand extends Command {
  async run() {
    debug('test 1')
    const {flags} = this.parse(DeployCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/qamarislam/Workspace/qdx/src/commands/deploy.js`)
    debug('test 2')
  }
}

DeployCommand.description = `Describe the command here
...
Extra documentation goes here
`

DeployCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = DeployCommand

const {Command, flags} = require('@oclif/command')
const puppeteer = require('puppeteer')

class DeployCommand extends Command {
  async run() {
    const {flags} = this.parse(DeployCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/qamarislam/Workspace/qdx/src/commands/deploy.js`)
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

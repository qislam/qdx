const {Command, flags} = require('@oclif/command')

class PuppeteerCommand extends Command {
  async run() {
    const {flags} = this.parse(PuppeteerCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/qamarislam/Workspace/qdx/src/commands/puppeteer.js`)
  }
}

PuppeteerCommand.description = `Describe the command here
...
Extra documentation goes here
`

PuppeteerCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = PuppeteerCommand

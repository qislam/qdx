const {Command, flags} = require('@oclif/command')

class MetapackageCommand extends Command {
  async run() {
    const {flags} = this.parse(MetapackageCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/qamarislam/Workspace/qdx/src/commands/metapackage.js`)
  }
}

MetapackageCommand.description = `Describe the command here
...
Extra documentation goes here
`

MetapackageCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = MetapackageCommand

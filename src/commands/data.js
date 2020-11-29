const {Command, flags} = require('@oclif/command')

class DataCommand extends Command {
  async run() {
    const {flags} = this.parse(DataCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/qamarislam/Workspace/qdx/src/commands/data.js`)
  }
}

DataCommand.description = `Describe the command here
...
Extra documentation goes here
`

DataCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = DataCommand

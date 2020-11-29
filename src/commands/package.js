const {Command, flags} = require('@oclif/command')

class PackageCommand extends Command {
  async run() {
    const {flags} = this.parse(PackageCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /Users/qamarislam/Workspace/qdx/src/commands/package.js`)
  }
}

PackageCommand.description = `Describe the command here
...
Extra documentation goes here
`

PackageCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = PackageCommand

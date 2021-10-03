const {Command, flags} = require('@oclif/command')
const {cli} = require('cli-ux')
const debug = require('debug')('qdx')
const path = require('path')
const fs = require('fs')
const _ = require('lodash')

const {getAbsolutePath, getFiles, getTimeStamp} = require('../utils/util')

class SnippetCommand extends Command {
  async run() {
    const {flags} = this.parse(SnippetCommand)
    let qdxSnippets

    cli.action.start('STARTED')
    if (!fs.existsSync(getAbsolutePath('.vscode'))) {
      cli.action.stop('snippet command can only be used in VSCode project.')
    }
    if (fs.existsSync(getAbsolutePath('.vscode/qdx.code-snippets'))) {
      qdxSnippets = JSON.parse(fs.readFileSync(getAbsolutePath('.vscode/qdx.code-snippets')))
    } else {
      qdxSnippets = {}
    }

    if (fs.existsSync(getAbsolutePath(flags.path))) {
      let content = fs.readFileSync(getAbsolutePath(flags.path), 'utf8')
      if (content) content += '$0'
      let snippet = {}
      let key = flags.alias || 'q1'
      let body = content.split('\n')
      _.remove(body,
        line => {
          return line.startsWith('//') || line.trim() === ''
        }
      )
      snippet.prefix = key
      snippet.body = body
      qdxSnippets[key] = snippet
    } else {
      cli.action.stop(flags.path + ' does not exist.')
    }

    fs.writeFileSync(
      getAbsolutePath('.vscode/qdx.code-snippets'),
      JSON.stringify(qdxSnippets, null, 4),
      {encoding: 'utf-8'}
    )
    cli.action.stop('COMPLETED')
  }
}

SnippetCommand.description = `Describe the command here
...
Extra documentation goes here
`

SnippetCommand.flags = {
  help: flags.help({char: 'h'}),
  alias: flags.string({char: 'a', required: true, description: 'Alias for the snippet'}),
  path: flags.string({char: 'p', required: true, description: 'Path to file that needs to be converted to snippet.'}),
}

module.exports = SnippetCommand

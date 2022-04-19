qdx
===

Salesforce command line for deployments

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/qdx.svg)](https://npmjs.org/package/qdx)
[![Downloads/week](https://img.shields.io/npm/dw/qdx.svg)](https://npmjs.org/package/qdx)
[![License](https://img.shields.io/npm/l/qdx.svg)](https://github.com/qislam/qdx/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g qdx
$ qdx COMMAND
running command...
$ qdx (-v|--version|version)
qdx/1.4.2 darwin-x64 node-v16.11.1
$ qdx --help [COMMAND]
USAGE
  $ qdx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`qdx help [COMMAND]`](#qdx-help-command)
* [`qdx package PACKAGENAME [COMMIT1] [COMMIT2]`](#qdx-package-packagename-commit1-commit2)
* [`qdx snippet`](#qdx-snippet)

## `qdx help [COMMAND]`

display help for qdx

```
USAGE
  $ qdx help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.18/src/commands/help.ts)_

## `qdx package PACKAGENAME [COMMIT1] [COMMIT2]`

To build a package to use with sfdx retrieve/deploy commands.

```
USAGE
  $ qdx package PACKAGENAME [COMMIT1] [COMMIT2]

OPTIONS
  -d, --deploy                 Deploys source already retrieved.
  -h, --help                   show CLI help
  -p, --path=path              Path to app directory or csv file.
  -r, --retrieve               Retrieve source based on YAML configuration.
  -s, --start                  Start a new package. Will create YAML file if not already exist.
  -u, --username=username
  --checkonly                  Set to true for deployment validation
  --csv                        Build metadata components based on a csv file.
  --delete                     Delete the specific components listed in the yaml file.
  --diff                       Build metadata components by running a diff.
  --diffwithbase=diffwithbase  Components added in current branch based on diff with base.
  --dir                        Build metadata components based on directory contents.
  --fill                       Set to true to include all metadata for types listed in yaml.
  --full                       Set to true to get a complete list of all metadata available.
  --installedpackage
  --projectpath=projectpath    Base path for the project code.
  --version=version            API version to use for SFDX
  --yaml                       Build metadata components based on a yml file.

DESCRIPTION
  ...
  # To Start a new package
  qdx package [packageName] --start
```

_See code: [src/commands/package.js](https://github.com/qislam/qdx/blob/v1.4.2/src/commands/package.js)_

## `qdx snippet`

Describe the command here

```
USAGE
  $ qdx snippet

OPTIONS
  -a, --alias=alias  (required) Alias for the snippet
  -h, --help         show CLI help
  -p, --path=path    (required) Path to file that needs to be converted to snippet.

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/snippet.js](https://github.com/qislam/qdx/blob/v1.4.2/src/commands/snippet.js)_
<!-- commandsstop -->

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
qdx/1.3.0 darwin-x64 node-v10.13.0
$ qdx --help [COMMAND]
USAGE
  $ qdx COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`qdx data`](#qdx-data)
* [`qdx help [COMMAND]`](#qdx-help-command)
* [`qdx metapackage`](#qdx-metapackage)
* [`qdx package PACKAGENAME [COMMIT1] [COMMIT2]`](#qdx-package-packagename-commit1-commit2)
* [`qdx puppeteer`](#qdx-puppeteer)
* [`qdx snippet`](#qdx-snippet)

## `qdx data`

Describe the command here

```
Describe the command here
...
Extra documentation goes here


USAGE
  $ qdx data

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/data.js](https://github.com/qislam/qdx/blob/v1.3.0/src/commands/data.js)_

## `qdx help [COMMAND]`

display help for qdx

```
display help for <%= config.bin %>

USAGE
  $ qdx help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `qdx metapackage`

Describe the command here

```
Describe the command here
...
Extra documentation goes here


USAGE
  $ qdx metapackage

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/metapackage.js](https://github.com/qislam/qdx/blob/v1.3.0/src/commands/metapackage.js)_

## `qdx package PACKAGENAME [COMMIT1] [COMMIT2]`

To build a package to use with sfdx retrieve/deploy commands.

```
To build a package to use with sfdx retrieve/deploy commands.
...
Extra documentation goes here


USAGE
  $ qdx package PACKAGENAME [COMMIT1] [COMMIT2]

OPTIONS
  -d, --deploy               Deploys source already retrieved.
  -h, --help                 show CLI help
  -p, --path=path            Path to app directory or csv file.
  -r, --retrieve             Retrieve source based on YAML configuration.
  -s, --start                Start a new package. Will create YAML file if not already exist.
  -u, --username=username
  --checkonly                Set to true for deployment validation
  --csv                      Build metadata components based on a csv file.
  --delete                   Delete the specific components listed in the yaml file.
  --diff                     Build metadata components by running a diff.
  --dir                      Build metadata components based on directory contents.
  --fill                     Set to true to include all metadata for types listed in yaml.
  --full                     Set to true to get a complete list of all metadata available.
  --installedpackage
  --projectpath=projectpath  Base path for the project code.
  --version=version          API version to use for SFDX
  --xml                      Build metadata components based on a xml file.
  --yaml                     Build metadata components based on a yml file.

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/package.js](https://github.com/qislam/qdx/blob/v1.3.0/src/commands/package.js)_

## `qdx puppeteer`

Describe the command here

```
Describe the command here
...
Extra documentation goes here


USAGE
  $ qdx puppeteer

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/puppeteer.js](https://github.com/qislam/qdx/blob/v1.3.0/src/commands/puppeteer.js)_

## `qdx snippet`

Describe the command here

```
Describe the command here
...
Extra documentation goes here


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

_See code: [src/commands/snippet.js](https://github.com/qislam/qdx/blob/v1.3.0/src/commands/snippet.js)_
<!-- commandsstop -->

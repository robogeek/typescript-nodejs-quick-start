oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g registrar-cli
$ registrar COMMAND
running command...
$ registrar (--version)
registrar-cli/0.0.0 linux-x64 node-v16.13.1
$ registrar --help [COMMAND]
USAGE
  $ registrar COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`registrar help [COMMAND]`](#registrar-help-command)
* [`registrar plugins`](#registrar-plugins)
* [`registrar plugins:inspect PLUGIN...`](#registrar-pluginsinspect-plugin)
* [`registrar plugins:install PLUGIN...`](#registrar-pluginsinstall-plugin)
* [`registrar plugins:link PLUGIN`](#registrar-pluginslink-plugin)
* [`registrar plugins:uninstall PLUGIN...`](#registrar-pluginsuninstall-plugin)
* [`registrar plugins update`](#registrar-plugins-update)

## `registrar help [COMMAND]`

Display help for registrar.

```
USAGE
  $ registrar help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for registrar.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `registrar plugins`

List installed plugins.

```
USAGE
  $ registrar plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ registrar plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `registrar plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ registrar plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ registrar plugins:inspect myplugin
```

## `registrar plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ registrar plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ registrar plugins add

EXAMPLES
  $ registrar plugins:install myplugin 

  $ registrar plugins:install https://github.com/someuser/someplugin

  $ registrar plugins:install someuser/someplugin
```

## `registrar plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ registrar plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ registrar plugins:link myplugin
```

## `registrar plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ registrar plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ registrar plugins unlink
  $ registrar plugins remove
```

## `registrar plugins update`

Update installed plugins.

```
USAGE
  $ registrar plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->

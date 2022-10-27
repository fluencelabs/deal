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
$ npm install -g cli
$ deal-cli COMMAND
running command...
$ deal-cli (--version)
cli/0.0.0 darwin-x64 node-v16.16.0
$ deal-cli --help [COMMAND]
USAGE
  $ deal-cli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`deal-cli hello PERSON`](#deal-cli-hello-person)
* [`deal-cli hello world`](#deal-cli-hello-world)
* [`deal-cli help [COMMAND]`](#deal-cli-help-command)
* [`deal-cli plugins`](#deal-cli-plugins)
* [`deal-cli plugins:install PLUGIN...`](#deal-cli-pluginsinstall-plugin)
* [`deal-cli plugins:inspect PLUGIN...`](#deal-cli-pluginsinspect-plugin)
* [`deal-cli plugins:install PLUGIN...`](#deal-cli-pluginsinstall-plugin-1)
* [`deal-cli plugins:link PLUGIN`](#deal-cli-pluginslink-plugin)
* [`deal-cli plugins:uninstall PLUGIN...`](#deal-cli-pluginsuninstall-plugin)
* [`deal-cli plugins:uninstall PLUGIN...`](#deal-cli-pluginsuninstall-plugin-1)
* [`deal-cli plugins:uninstall PLUGIN...`](#deal-cli-pluginsuninstall-plugin-2)
* [`deal-cli plugins update`](#deal-cli-plugins-update)

## `deal-cli hello PERSON`

Say hello

```
USAGE
  $ deal-cli hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/fluencelabs/deal/blob/v0.0.0/dist/commands/hello/index.ts)_

## `deal-cli hello world`

Say hello world

```
USAGE
  $ deal-cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ deal-cli hello world
  hello world! (./src/commands/hello/world.ts)
```

## `deal-cli help [COMMAND]`

Display help for deal-cli.

```
USAGE
  $ deal-cli help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for deal-cli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.15/src/commands/help.ts)_

## `deal-cli plugins`

List installed plugins.

```
USAGE
  $ deal-cli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ deal-cli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.4/src/commands/plugins/index.ts)_

## `deal-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ deal-cli plugins:install PLUGIN...

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
  $ deal-cli plugins add

EXAMPLES
  $ deal-cli plugins:install myplugin 

  $ deal-cli plugins:install https://github.com/someuser/someplugin

  $ deal-cli plugins:install someuser/someplugin
```

## `deal-cli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ deal-cli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ deal-cli plugins:inspect myplugin
```

## `deal-cli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ deal-cli plugins:install PLUGIN...

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
  $ deal-cli plugins add

EXAMPLES
  $ deal-cli plugins:install myplugin 

  $ deal-cli plugins:install https://github.com/someuser/someplugin

  $ deal-cli plugins:install someuser/someplugin
```

## `deal-cli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ deal-cli plugins:link PLUGIN

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
  $ deal-cli plugins:link myplugin
```

## `deal-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ deal-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ deal-cli plugins unlink
  $ deal-cli plugins remove
```

## `deal-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ deal-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ deal-cli plugins unlink
  $ deal-cli plugins remove
```

## `deal-cli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ deal-cli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ deal-cli plugins unlink
  $ deal-cli plugins remove
```

## `deal-cli plugins update`

Update installed plugins.

```
USAGE
  $ deal-cli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->

# DEPSAVE
Straightforward cli tool for downloading package dependencies tgz using standard
npm approach.

## Compatiblity
- nodejs >= 8.5.0

## Features
- Downloading tgz files for packages, passed in command line
- Downloading tgz files for dependencies from package.json


## Installation
```bash
npm i -g depsave
```


## Usage
```
Usage: depsave [options] [package-names...]

Options:
  -v, --version                        output the version number
  -d, --directory [path/to/directory]  custom directory for downloaded dependencies (default: depsave-<epoch_time>)
  -f, --file [path/to/package.json]    package.json file to fetch dependencies from
  -c, --concurrent [int]               maximum amount of concurrent downloads (default: 20)
  -h, --help                           output usage information
```

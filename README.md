# Koy

[![](https://badgen.net/npm/v/koy)](https://npm.im/koy)
[![](https://badgen.net/packagephobia/install/koy)](https://packagephobia.now.sh/result?p=koy)
![](https://badgen.net/badge/icon/chrome?icon=chrome&label)

> Koy is a markdown previewer powered by [Carlo](https://github.com/GoogleChromeLabs/carlo).

![preview](https://user-images.githubusercontent.com/914329/47839466-c95b6d80-dded-11e8-835c-259bacea7a86.png)

## Features

- View `README.md` in current working directory by default.
- Render markdown in GitHub style.
- Live preview and automatic re-rendering of file changes.

## Install

```bash
$ npm i koy -g
```

## Usage

```bash
$ koy

# Or a specific file
$ koy some-file.md

# Or a README.md in Github repo
$ koy gh:djyde/koy

# Or stdin
$ curl -sL https://github.com/djyde/koy/raw/master/README.md | koy

# Or a README.md in NPM
$ koy npm:koy
```

# License

MIT License

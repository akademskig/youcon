# Youcon

## Installation

`npm i -g youcon`

## Usage

``` js
const Youcon = require("youcon").default

new Youcon().init(["https://www.youtube.com/watch\?v\=07d2dXHYb94"], "./movies", true, "avi").catch(err => { console.error(err) })

```

### From command line

`youcon -url [video-url]`


#### Options

`-c - convert to .mp3`
`-f [format] - convert to any other format`


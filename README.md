# hes-soap-client
client for the home energy survey api

## usage
```js
var hesSoapClient = require('hes-soap-client')

hesSoapClient({
  apiKey: process.env.apiKey,
  zipCode: 94103,
  area: 2800,
  year: 1940
}).then(console.log)

```

a barebone node.js client for the [Home Energy Survey api](https://developers.buildingsapi.lbl.gov/hes/documentation/HES_API_methods)

It is not a true soap implementation and instead only does what we need it to do:
given a zipcode, square footage area, and construction year, it returns energy estimates.

Note, this api can be very slow. Response times of 20+ seconds are not uncommon.

You'll need an [API key](https://developers.buildingsapi.lbl.gov/hes/licensing) from Berkeley Lab.

## api
### `hesSoapClient : ({apiKey : String, zipCode : Number, area : Number, year : Number }) => Promise<{ cost : Number, kWh : Number }>`



## installation

    $ npm install hes-soap-client


## running the tests

From package root:

    $ npm install
    $ npm test


## contributors

- jden <jason@denizac.org>


## license

ISC. (c) MMXIV jden <jason@denizac.org>. See LICENSE.md

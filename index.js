var fs = require('fs')
var path = require('path')
var request = require('pr-request')

var sessionXml = fs.readFileSync(path.resolve(__dirname, './xml/createSession.xml')).toString()
var saveXml = fs.readFileSync(path.resolve(__dirname, './xml/saveSession11.xml')).toString()
var resultsXml = fs.readFileSync(path.resolve(__dirname, './xml/retrieveDetailedSessionResults11.xml')).toString()

function extractSessionId(xml) {
  try {
    return xml.match(/sessionId\^(\d+);uniqueName/)[1]
  } catch (e) {
    throw new Error('could not get sessionId')
  }
}

function toBody(response) {
  return response.body
}

function parseResult(xml) {
  try {
    var cost = xml.match(/<BaseCost xsi:type="xsd:string">(\d+)<\/BaseCost>/)[1]
    var kWh = xml.match(/<existing xsi:type="xsd:string">([\d,]+) kWh<\/existing>/)[1]
                 .replace(/[^\d]/,'')

    return {
      cost: parseInt(cost),
      kWh: parseInt(kWh)
    }
  } catch (e) {
    throw new Error('could not parse estimate')
  }
}


function energyModel(params) {

  function soap(body) {
    return request({
      // proxy: 'http://127.0.0.1:8888',
      url: 'http://proapp.hescloud.net/session/',
      headers: {'content-type': 'text/xml; charset=UTF-8'},
      body: body
        .replace('$apiKey', params.apiKey)
    })
    
  }


  function newSession(zipCode) {
    return soap(
        sessionXml
        .replace('$zipCode', zipCode)
      )
      .then(toBody)
      .then(extractSessionId)
  }

  function setParams(params) {
    var xml = saveXml
    Object.keys(params).forEach(function (param) {
      xml = xml.replace('$'+param, params[param])
    })
    return soap(xml).then(function () {
      return params.sessionId
    })
  }

  function getEstimate(sessionId) {
    return soap(
      resultsXml
        .replace('$sessionId', sessionId)
      )
      .then(toBody)
      .then(parseResult)
  }



  return newSession(params.zipCode)
  .then(function (sessionId) {
    return setParams({
      sessionId: sessionId,
      area: params.area,
      year: params.year
    })
  })
  .then(getEstimate)
}

module.exports = energyModel

// example:
//
// energyModel({
//   apiKey: process.env.apiKey,
//   zipCode: 94103,
//   area: 2800,
//   year: 1940
// }).then(console.log)

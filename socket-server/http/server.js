const https_options = require('./https_option')
const express = require('express');
const app = express();
const https = require('https')
// const http = require('http')

function init(config) {
  const server = https.createServer(https_options)
  server.listen(config.SERVER_PORT, () => {
    console.log(`Listening https on ${server.address().address}:${server.address().port}`)
  })
  server.once('error', (err) => {
    console.log('Ошибка запуска')
  })
  return server
}


module.exports = init

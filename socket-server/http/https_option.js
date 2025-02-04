const config = require('config')
const fs = require('fs')

let options = {
  key: fs.readFileSync('keys/server.key'),
  cert: fs.readFileSync('keys/server.crt')
}

if (config.ENV === 'prod') {
  const privateKey = fs.readFileSync('/etc/letsencrypt/live/' + config.NAME_SERVER + '/privkey.pem', 'utf8')
  const certificate = fs.readFileSync('/etc/letsencrypt/live/' + config.NAME_SERVER + '/cert.pem', 'utf8')
  const ca = fs.readFileSync('/etc/letsencrypt/live/' + config.NAME_SERVER + '/chain.pem', 'utf8')
  options =
    {
      key: privateKey,
      cert: certificate,
      ca: ca
    }
}
module.exports = options

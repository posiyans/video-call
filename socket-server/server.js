const config = require('./config/default.json')
const server = require('./http/server')(config)
const VideoClass = require('./Video/VideoClass.js')
const io = require('socket.io')(server, {
  allowEIO3: true,
  cors: config.CORS
})
const Video = new VideoClass(io)

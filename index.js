const express = require('express')
const server  = express()
const PORT    = 3001
const bodyParser       = require('body-parser')
const mongoose         = require('mongoose')
const url              = 'mongodb+srv://admin:admin@cluster0-4oo8e.mongodb.net/test?retryWrites=true&w=majority'
const { LOGIN }        = require('./route/login.route')
const { REGESTION }    = require('./route/regestion.route')
const { POST }         = require('./route/post')
const { NEWFEED }      = require('./route/newfeed')
const { HOME }         = require('./route/home')
const { MOREINFO }     = require('./route/moreinfo')
const { FRIEND }       = require('./route/friend')
const { HOMEOFFRIEND } = require('./route/homeOfFriend')
const { FRIENDOFFRIEND } = require('./route/friendOfFriend')
const { LISTIMG }      = require('./route/listimg')
const { IMGOFFRIEND } = require('./route/listimgOfFriend')
const session          = require("express-session")({
  secret: "my-secret",
  resave: true,
  saveUninitialized: true,
  cookie: {maxAge:60*60*60*24}
});
server.use(bodyParser.urlencoded({ extended: false }))
server.use(bodyParser.json())
server.use('/findlove',LOGIN)
server.use('/findlove',REGESTION)
server.use('/findlove',POST)
server.use('/findlove',NEWFEED)
server.use('/findlove',HOME)
server.use('/findlove',MOREINFO)
server.use('/findlove',FRIEND)
server.use('/findlove',HOMEOFFRIEND)
server.use('/findlove',FRIENDOFFRIEND)
server.use('/findlove',LISTIMG)
server.use('/findlove',IMGOFFRIEND)
server.use(express.static("imgStore"));
server.set('view engine','ejs');
server.set('views','./views');
mongoose.connect(url);
mongoose.connection.once('open', () => {
    server.listen(PORT, () => console.log(`server started at port ${PORT}`))
})
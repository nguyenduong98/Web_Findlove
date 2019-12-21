const express = require('express')
const router  = express.Router()
const { USER_MODEL }     = require('../model/user.model')
const session            = require('../index')
const { verifyJWT }      = require('../helper/jwt')
const { MOREINFO_MODEL } = require('../model/moreInfo.model')

router.route('/friend')
    .get(async(req,res)=>{
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        const userlogin          = await USER_MODEL.findOne({_id:id})
        const { username,friend }= userlogin
        const customizeUsername  = username.split(' ')
        const name               = customizeUsername[customizeUsername.length-1]
        const moreinfo           = await MOREINFO_MODEL.findOne({idUser:id})
        const listfriend         = await USER_MODEL.find({_id:{$in:friend}})
        res.render('friend', {userlogin,name,moreinfo,listfriend})
    })

exports.FRIEND = router
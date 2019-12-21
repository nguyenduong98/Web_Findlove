const express = require('express')
const router  = express.Router()
const { USER_MODEL }     = require('../model/user.model')
const session            = require('../index')
const { verifyJWT }      = require('../helper/jwt')
const { MOREINFO_MODEL } = require('../model/moreInfo.model')

router.route('/friend/:idUser')
    .get(async(req,res)=>{
        const { idUser }         = req.params
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        const userlogin          = await USER_MODEL.findOne({_id:id})
        const { username}        = userlogin
        const customizeUsername  = username.split(' ')
        const name               = customizeUsername[customizeUsername.length-1]
        const userOfIdUser       = await USER_MODEL.findOne({_id:idUser})
        const { friend }         = userOfIdUser
        const moreinfo           = await MOREINFO_MODEL.findOne({idUser:idUser})
        const listfriend         = await USER_MODEL.find({_id:{$in:friend}})
        res.render('friendOfFriend', {userlogin,name,moreinfo,userOfIdUser,listfriend,idUser})
    })

exports.FRIENDOFFRIEND = router
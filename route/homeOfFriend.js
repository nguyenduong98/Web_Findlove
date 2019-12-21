const express = require('express')
const router  = express.Router()
const { USER_MODEL } = require('../model/user.model')
const session          = require('../index')
const { verifyJWT } = require('../helper/jwt')
const { uploadMulter } = require('../helper/multer')
const { POST_MODEL } =require('../model/post.model')
const { MOREINFO_MODEL } = require('../model/moreInfo.model')
const path = require('path')
const fs  = require('fs')

router.route('/home/:idUser')
    .get(async(req,res)=>{
        const { idUser }         = req.params
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        const userlogin          = await USER_MODEL.findOne({_id:id})
        const { username }       = userlogin
        const customizeUsername  = username.split(' ')
        const name               = customizeUsername[customizeUsername.length-1]
        const userOfIdUser       = await USER_MODEL.findOne({_id:idUser})
        const listpost           = await POST_MODEL.find({idUser:idUser}).sort({_id:-1})
        const moreinfo           = await MOREINFO_MODEL.findOne({idUser:idUser})
        res.render('homeofFriend', {userlogin,name,listpost,moreinfo,userOfIdUser,idUser})
    })

exports.HOMEOFFRIEND = router
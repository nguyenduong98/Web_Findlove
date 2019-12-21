const express = require('express')
const router  = express.Router()
const { POST_MODEL } = require('../model/post.model')
const session            = require('../index')
const { verifyJWT }      = require('../helper/jwt')
const { MOREINFO_MODEL } = require('../model/moreInfo.model')
const { USER_MODEL } = require('../model/user.model')

router.route('/imgoffriend/:idUser')
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
        const moreinfo           = await MOREINFO_MODEL.findOne({idUser:idUser})
        const listpost           = await POST_MODEL.find({idUser:idUser}).sort({_id:-1})
        let i = 0
        let listimg1             = [{}]
        let listimg2             = [{}]
        listpost.forEach(item=>{
            if(i%2==0)
                listimg1[i] = item.img
            else
                listimg2[i-1] = item.img
            i++
        })
        res.render('listimgOfFriend', {userlogin,name,moreinfo,userOfIdUser,listimg1,listimg2,idUser})
    })

exports.IMGOFFRIEND = router
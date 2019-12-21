const express = require('express')
const router  = express.Router()
const { USER_MODEL } = require('../model/user.model')
const session          = require('../index')
const { verifyJWT } = require('../helper/jwt')
const { POST_MODEL } =require('../model/post.model')
const { MOREINFO_MODEL } = require('../model/moreInfo.model')


router.route('/listimg')
    .get(async(req,res)=>{
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        const userlogin          = await USER_MODEL.findOne({_id:id})
        const { username }       = userlogin
        const customizeUsername  = username.split(' ')
        const name               = customizeUsername[customizeUsername.length-1]
        const moreinfo           = await MOREINFO_MODEL.findOne({idUser:id})
        const listpost           = await POST_MODEL.find({idUser:id}).sort({_id:-1})
        let listimg1             = [{}]
        let listimg2             = [{}]
        let i = 0
        listpost.forEach(item=>{
           if(item.img){
                if(i%2==0)
                    listimg1[i] = item.img
                else
                    listimg2[i-1] = item.img
               i++
           }
        }) 
        
        res.render('listimg', {userlogin,name,moreinfo,listimg1,listimg2})
    })

exports.LISTIMG = router

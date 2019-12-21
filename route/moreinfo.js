const express = require('express')
const router  = express.Router()
const { USER_MODEL } = require('../model/user.model')
const session        = require('../index')
const { verifyJWT }  = require('../helper/jwt')
const { MOREINFO_MODEL }   = require('../model/moreInfo.model')

router.route('/moreinfo')
    .get(async(req,res)=>{
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        const userlogin          = await USER_MODEL.findOne({_id:id})
        const { username }       = userlogin
        const customizeUsername  = username.split(' ')
        const name               = customizeUsername[customizeUsername.length-1]
        const moreinfo           = await MOREINFO_MODEL.findOne({idUser:id})
        res.render('updateMoreinfo',{userlogin,name,moreinfo})
    })

router.route('/updatemoreinfo')
    .post(async(req,res)=>{
        const { about,height,weight,live,hometown,school,job,salary,hobby,quandiem,maunguoi } = req.body
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        const updateMoreinfo     = await MOREINFO_MODEL.update({idUser:id},{$set:{introduce:about, height:height, dress:live, weight:weight, homeTown:hometown, school:school, job:job, salary:salary, hobby:hobby, viewOfLove:quandiem, kindOfLover:maunguoi }})
        res.redirect('/findlove/home')
    })

exports.MOREINFO = router
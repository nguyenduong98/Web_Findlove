const express = require('express')
const router  = express.Router()
const { USER_MODEL }     = require('../model/user.model')
const { MOREINFO_MODEL } = require('../model/moreInfo.model')

router.route('/regestion')
    .get((req,res)=>{
        res.render('regestion',{})
    })
    .post(async(req,res)=>{
        const { username, password, email, gender } = req.body
        if(!username || !password || !email || !gender)
            res.redirect('/findlove/login')
        else {
            const userRegestion = new USER_MODEL({username:username, password:password, email:email, gender:gender})
            const userRegestionSave = await userRegestion.save()
            const moreinfo      = new MOREINFO_MODEL({introduce:'', height:'', dress:'', weight:'', homeTown:'', school:'', job:'', salary:'', hobby:'', viewOfLove:'', kindOfLover:'', idUser:userRegestionSave._id})
            const moreinfosave  = await moreinfo.save()
            res.redirect('/findlove/login')
        }
    })

exports.REGESTION = router
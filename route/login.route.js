const express = require('express')
const router  = express.Router()
const { USER_MODEL } = require('../model/user.model')
const session = require('../index')
const { sigJWT } = require('../helper/jwt')

router.route('/login')
    .get((req,res)=>{
        res.render('login')
    })
    .post(async(req,res)=>{
        const { usernamelogin, passwordlogin } = req.body
        const userLogin = await USER_MODEL.findOne({username:usernamelogin, password:passwordlogin})
        if(!userLogin)
            res.redirect('/findlove/login')
        else{
            const objectUser = { email: userLogin.email, name:userLogin.username, id:userLogin._id}
            const token = await sigJWT(objectUser)
            session.token = token
            res.redirect('/findlove/newfeed')
        }
    })

exports.LOGIN=router
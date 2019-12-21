// const express = require('express')
// const router  = express.Router()
// const { USER_MODEL } = require('../model/user.model')
// const session = require('../index')
// const { verifyJWT } = require('../helper/jwt')
// const { DEGREE } = require('../helper/degree')

// router.route('/addfriend')
//     .get(async(req,res)=>{
//         const { token }  = session.token
//         const dataofuser = await verifyJWT(token)
//         const { id }     = dataofuser.data
//         const userlogin  = await USER_MODEL.findOne({_id:id})
//         const { receivedAddFriend,waitingAddFriend, friend } = await userlogin
//         const listUser   = await USER_MODEL.find({$and:[{_id:{$nin:waitingAddFriend}},{_id:{$nin:friend}}]})
//         const listUserWaitAcept = await USER_MODEL.find({$and:[{_id:{$ne:id}},{_id:{$in:waitingAddFriend}}]})
//         const listFriend = await USER_MODEL.find({$and:[{_id:{$ne:id}},{_id:{$in:friend}}]})
//         DEGREE(listUser)
//         const listUserDegree = await USER_MODEL.find({$and:[{_id:{$nin:waitingAddFriend}},{_id:{$nin:friend}},{_id:{$ne:id}}]}).sort({degree:-1})
//         console.log(listUserDegree)
//         res.render('addfriend',{ listUserDegree, receivedAddFriend, userlogin, listUserWaitAcept, listFriend })
//         // res.json({listUserDegree})
//     })
 
// router.route('/sentAddfriend/:idUserReceived')
//     .get(async(req,res)=>{
//         const { idUserReceived } =req.params
//         const { token }          = session.token
//         const dataofuser         = await verifyJWT(token)
//         const { id }             = dataofuser.data
//         let updateUserReceivedAddFriend = await USER_MODEL.findByIdAndUpdate({_id:id},{$addToSet:{receivedAddFriend:idUserReceived}},{new:true})
//         let updateUserwaitingAddFriend  = await USER_MODEL.findByIdAndUpdate({_id:idUserReceived},{$addToSet: {waitingAddFriend:id}},{new:true})
//         res.redirect('/findlove/addfriend')
//     })

// router.route('/removeAddFriend/:idUserReceived')
//     .get(async(req,res)=>{
//         const { idUserReceived } = req.params
//         const { token }          = session.token
//         const dataofuser         = await verifyJWT(token)
//         const { id }             = dataofuser.data
//         let removeUserReceivedAddFriend = await USER_MODEL.findByIdAndUpdate({_id:id},{$pull:{receivedAddFriend:idUserReceived}})
//         let removeUserwaitingAddFriend  = await USER_MODEL.findByIdAndUpdate({_id:idUserReceived},{$pull: {waitingAddFriend:id}},{new:true})
//         res.redirect('/findlove/addfriend')
//     })

// router.route('/aceptaddfriend/:idUserSentAddFriend')
//     .get(async(req,res)=>{
//         const { idUserSentAddFriend } = req.params
//         const { token }               = session.token
//         const dataofuser              = await verifyJWT(token)
//         const { id }                  = dataofuser.data
//         let addAceptaddfriendToFriend = await USER_MODEL.findByIdAndUpdate({_id:id},{$addToSet:{friend:idUserSentAddFriend}})
//         let addToFriend               = await USER_MODEL.findByIdAndUpdate({_id:idUserSentAddFriend},{$addToSet:{friend:id}})
//         let removeAceptaddfriend      = await USER_MODEL.findByIdAndUpdate({_id:id},{$pull:{waitingAddFriend:idUserSentAddFriend}})
//         res.redirect('/findlove/addfriend')
//     })

// router.route('/unfriend/:idUserUnfriend')
//     .get(async(req,res)=>{
//         const { idUserUnfriend }      = req.params
//         const { token }               = session.token
//         const dataofuser              = await verifyJWT(token)
//         const { id }                  = dataofuser.data 
//         let removeUserUnfriend        = await USER_MODEL.findByIdAndUpdate({_id:id},{$pull:{friend:idUserUnfriend}})
//         let removeUser                = await USER_MODEL.findByIdAndUpdate({_id:idUserUnfriend},{$pull:{friend:id}})
//         res.redirect('/findlove/addfriend')
//     })

// exports.ADDFRIEND = router
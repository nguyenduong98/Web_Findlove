const express          = require('express')
const router           = express.Router()
const { USER_MODEL }   = require('../model/user.model')
const session          = require('../index')
const { verifyJWT }    = require('../helper/jwt')
const { DEGREE }       = require('../helper/degree')
const { uploadMulter } =require('../helper/multer')
const { POST_MODEL }   = require('../model/post.model')
const { GAME_MODEL }   = require('../model/game.model')
const path             = require('path')
const fs               = require('fs')

router.route('/newfeed')
    .get(async(req,res)=>{
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        const userlogin          = await USER_MODEL.findOne({_id:id})
        const { username,receivedAddFriend,waitingAddFriend, friend } = userlogin
        const customizeUsername  = username.split(' ')
        const name               = customizeUsername[customizeUsername.length-1]
        const listUserWaitAcept  = await USER_MODEL.find({_id:{$in:waitingAddFriend}})
        const userPlayGame       = await USER_MODEL.aggregate([{ $sample: {size: 5}}]);
        const listgame           = await GAME_MODEL.aggregate([{ $sample: {size: 1}}]);
        const game               = listgame[0]
        const listUserDegree     = await USER_MODEL.find({$and:[{_id:{$nin:waitingAddFriend}},{_id:{$nin:friend}},{_id:{$ne:id}}]}).sort({degree:-1})
        const listpost = await POST_MODEL.aggregate(
            [
                { 
                    "$project" : {
                        "_id" : Object, 
                        "posts" : "$$ROOT"
                    }
                }, 
                { 
                    "$lookup" : {
                        "localField" : "posts.idUser", 
                        "from" : "users", 
                        "foreignField" : "_id", 
                        "as" : "users"
                    }
                }, 
                { 
                    "$unwind" : {
                        "path" : "$users", 
                        "preserveNullAndEmptyArrays" : false
                    }
                }, 
                { 
                    "$lookup" : {
                        "localField" : "posts._id", 
                        "from" : "userandposts", 
                        "foreignField" : "idPost", 
                        "as" : "userandposts"
                    }
                }, 
                { 
                    "$unwind" : {
                        "path" : "$userandposts", 
                        "preserveNullAndEmptyArrays" : false
                    }
                }, 
                { 
                    "$match" : {
                        "$or" : [
                            {
                                "posts.idUser" : {
                                    "$in" : friend
                                }
                            },
                            {
                                "users.username":username
                            }
                        ]
                    }
                },
                { 
                    "$sort" : {
                        "posts._id" :-1
                    }
                }
            ]
        );
      
        res.render('newfeed',{ userlogin,name,listUserDegree,listUserWaitAcept,listpost,userPlayGame,receivedAddFriend,game })
    })

router.route('/sentAddfriend/:idUserReceived')
    .get(async(req,res)=>{
        const { idUserReceived } =req.params
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        let updateUserReceivedAddFriend = await USER_MODEL.findByIdAndUpdate({_id:id},{$addToSet:{receivedAddFriend:idUserReceived}},{new:true})
        let updateUserwaitingAddFriend  = await USER_MODEL.findByIdAndUpdate({_id:idUserReceived},{$addToSet: {waitingAddFriend:id}},{new:true})
        res.redirect('/findlove/newfeed')
    })

router.route('/removeAddFriend/:idUserReceived')
    .get(async(req,res)=>{
        const { idUserReceived } = req.params
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        let removeUserReceivedAddFriend = await USER_MODEL.findByIdAndUpdate({_id:id},{$pull:{receivedAddFriend:idUserReceived}})
        let removeUserwaitingAddFriend  = await USER_MODEL.findByIdAndUpdate({_id:idUserReceived},{$pull: {waitingAddFriend:id}},{new:true})
        res.redirect('/findlove/newfeed')
    })

router.route('/aceptaddfriend/:idUserSentAddFriend')
    .get(async(req,res)=>{
        const { idUserSentAddFriend } = req.params
        const { token }               = session.token
        const dataofuser              = await verifyJWT(token)
        const { id }                  = dataofuser.data
        let addAceptaddfriendToFriend = await USER_MODEL.findByIdAndUpdate({_id:id},{$addToSet:{friend:idUserSentAddFriend}})
        let addToFriend               = await USER_MODEL.findByIdAndUpdate({_id:idUserSentAddFriend},{$addToSet:{friend:id}})
        let removeAceptaddfriend      = await USER_MODEL.findByIdAndUpdate({_id:id},{$pull:{waitingAddFriend:idUserSentAddFriend}})
        const userSentAddFriend       = await USER_MODEL.findOne({_id:idUserSentAddFriend})
        const user                    = await USER_MODEL.findOne({_id:id})
        const listUser                = await USER_MODEL.find({})
        const numberUser              = listUser.length
        DEGREE(user,userSentAddFriend,numberUser)
        res.redirect('/findlove/newfeed')
    })

router.route('/refuse/:idUserSentAddFriend')
    .get(async(req,res)=>{
        const { idUserSentAddFriend } = req.params
        const { token }               = session.token
        const dataofuser              = await verifyJWT(token)
        const { id }                  = dataofuser.data 
        let removeUserSentAddFriend   = await USER_MODEL.findByIdAndUpdate({_id:id},{$pull:{waitingAddFriend:idUserSentAddFriend}}) 
        let removeUserReceived        = await USER_MODEL.findByIdAndUpdate({_id:idUserSentAddFriend},{$pull:{receivedAddFriend:id}}) 
        res.redirect('/findlove/newfeed')
    })



exports.NEWFEED = router
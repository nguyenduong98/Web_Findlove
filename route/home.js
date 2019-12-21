const express = require('express')
const router  = express.Router()
const { USER_MODEL } = require('../model/user.model')
const session          = require('../index')
const { verifyJWT } = require('../helper/jwt')
const { uploadMulter } = require('../helper/multer')
const { POST_MODEL } =require('../model/post.model')
const { MOREINFO_MODEL } = require('../model/moreInfo.model')
const { USERANDPOST_MODEL } = require('../model/userlikepost')
const path = require('path')
const fs  = require('fs')

router.route('/home')
    .get(async(req,res)=>{
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        const userlogin          = await USER_MODEL.findOne({_id:id})
        const { username }       = userlogin
        const customizeUsername  = username.split(' ')
        const name               = customizeUsername[customizeUsername.length-1]
        const listpost           = await POST_MODEL.find({idUser:id}).sort({_id:-1})
        const moreinfo           = await MOREINFO_MODEL.findOne({idUser:id})
        res.render('home', {userlogin,name,listpost,moreinfo})
    })

router.route('/home/updateimgcover')
    .post(uploadMulter.single('updateImgCover'),async(req,res)=>{
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        const updateImgCover     = req.file
        const userIsLoginning    = await USER_MODEL.findOne({_id:id})
        const { username }       = userIsLoginning
        const { imgCover }       = userIsLoginning
        if(!updateImgCover){
            res.redirect('/findlove/home')
        }else if(imgCover == "imgcover.jpg"){
            const userAfterUpdateCoverimg = await USER_MODEL.updateOne({_id:id},{$set:{imgCover:updateImgCover.originalname}})
            const removePost              = await POST_MODEL.deleteOne({img:imgCover})
            const createPost              = new POST_MODEL({status:`${username} đã cập nhật ảnh bìa`, img:updateImgCover.originalname, idUser:id})
            const createPostSave          = await createPost.save()
            const newUserandPost  = new USERANDPOST_MODEL({idPost:createPostSave._id})
            const saveUserandPost = await newUserandPost.save()
            res.redirect('/findlove/home')
        }else{
            const userAfterUpdateCoverimg = await USER_MODEL.updateOne({_id:id},{$set:{imgCover:updateImgCover.originalname}})
            const removePost      = await POST_MODEL.deleteOne({img:imgCover})
            const createPost      = new POST_MODEL({status:`${username} đã cập nhật ảnh bìa`, img:updateImgCover.originalname, idUser:id})
            const createPostSave  = await createPost.save()
            const newUserandPost  = new USERANDPOST_MODEL({idPost:createPostSave._id})
            const saveUserandPost = await newUserandPost.save()
            const pathOfImgCover  = path.resolve(__dirname,`../imgStore/img/${imgCover}`) 
            fs.unlink(pathOfImgCover,(error, message)=>{ 
                if(error) res.json({error:true, message:'Lỗi Không Thể Xóa Ảnh'})
            })
            res.redirect('/findlove/home')      
        }
    })

router.route('/home/updateavata')
    .post(uploadMulter.single('updateAvata'),async(req,res)=>{
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data
        const updateAvata        = req.file
        const userIsLoginning    = await USER_MODEL.findOne({_id:id})
        const { avatar }         = userIsLoginning
        if(!updateAvata){
            res.redirect('/findlove/home')
        }else if(avatar == "avata.jpg"){
            const { username }            = userIsLoginning
            const userAfterUpdateavata    = await USER_MODEL.updateOne({_id:id},{$set:{avatar:updateAvata.originalname}})
            const removePost              = await POST_MODEL.deleteOne({img:avatar})
            const createPost              = new POST_MODEL({status:`${username} đã cập nhật ảnh đại diện`, img:updateAvata.originalname, idUser:id})
            const createPostSave          = await createPost.save()
            const newUserandPost  = new USERANDPOST_MODEL({idPost:createPostSave._id})
            const saveUserandPost = await newUserandPost.save()
            res.redirect('/findlove/home')
        }else{
            const { username }            = userIsLoginning
            const userAfterUpdateavata    = await USER_MODEL.updateOne({_id:id},{$set:{avatar:updateAvata.originalname}})
            const removePost              = await POST_MODEL.deleteOne({img:avatar})
            const createPost              = new POST_MODEL({status:`${username} đã cập nhật ảnh đại diện`, img:updateAvata.originalname, idUser:id})
            const createPostSave          = await createPost.save()
            const newUserandPost  = new USERANDPOST_MODEL({idPost:createPostSave._id})
            const saveUserandPost = await newUserandPost.save()
            const pathOfImgCover = path.resolve(__dirname,`../imgStore/img/${avatar}`) 
            fs.unlink(pathOfImgCover,(error, message)=>{  
                if(error) res.json({error:true, message:'Lỗi Không Thể Xóa Ảnh'})
            })
            res.redirect('/findlove/home')      
        }
    })  

exports.HOME = router
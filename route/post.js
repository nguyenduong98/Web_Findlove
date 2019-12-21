const express          = require('express')
const router           = express.Router()
const { USER_MODEL }   = require('../model/user.model')
const session          = require('../index')
const { verifyJWT }    = require('../helper/jwt')
const { uploadMulter } =require('../helper/multer')
const { POST_MODEL }   = require('../model/post.model')
const { USERANDPOST_MODEL } = require('../model/userlikepost') 
const { COMMENT_MODEL }     = require('../model/comment.model')
const mongoose              = require('mongoose')
const path              = require('path')
const fs                = require('fs')      

router.route('/addpost')
    .post(uploadMulter.single('img'),async(req,res)=>{
        const { token }               = session.token
        const dataofuser              = await verifyJWT(token)
        const { id }                  = dataofuser.data 
        const { status }              = req.body
        const  originalname           = req.file

        if(!status && !originalname)
            res.redirect('/findlove/newfeed')
        else if(!originalname){
            const newPost  = new POST_MODEL({status:status, img:'', idUser:id,ObjectPostShare:{}})
            const savePost = await newPost.save()
            const newUserandPost  = new USERANDPOST_MODEL({idPost:savePost._id})
            const saveUserandPost = await newUserandPost.save()
            res.redirect('/findlove/newfeed')
        }else{
            const  imgname = originalname.originalname
            const newPost  = new POST_MODEL({status:status, img:imgname, idUser:id,ObjectPostShare:{}})
            const savePost = await newPost.save()
            const newUserandPost  = new USERANDPOST_MODEL({idPost:savePost._id})
            const saveUserandPost = await newUserandPost.save()
            res.redirect('/findlove/newfeed')
        }
    })

router.route('/deletepost/:idpost')
    .get(async(req,res)=>{
        const { token }               = session.token
        const dataofuser              = await verifyJWT(token)
        const { id }                  = dataofuser.data 
        const userIsLoginning = await USER_MODEL.findOne({_id:id})
        const { idpost }      = req.params 
        const  postRemove     = await POST_MODEL.findOne({_id:idpost})
        if(postRemove.idUser == id){
            if(!postRemove.img || userIsLoginning.avatar == postRemove.img || userIsLoginning.imgCover == postRemove.img){
                const listPostAfterRemove = await POST_MODEL.deleteOne({_id:idpost})
                const removeUserandPost   = await USERANDPOST_MODEL.deleteOne({_id:idpost})
                const removePostShare     = await POST_MODEL.deleteMany({"ObjectPostShare.posts._id":idpost})
                res.redirect('/findlove/newfeed')
            }else{
                const imgOfPostRemove = postRemove.img 
                var listPostAfterRemove = await POST_MODEL.deleteOne({_id:idpost}) 
                const removeUserandPost   = await USERANDPOST_MODEL.deleteOne({idPost:idpost})
                const removePostShare     = await POST_MODEL.deleteMany({"posts.ObjectPostShare.posts._id":idpost})
                const pathOfImgOfPostRemove = path.resolve(__dirname,`../imgStore/img/${imgOfPostRemove}`) 
                fs.unlink(pathOfImgOfPostRemove,(error, message)=>{  
                    if(error) res.json({error:true, message:'Lỗi Không Thể Xóa Ảnh'})
                })
                res.redirect('/findlove/newfeed')
            }
        }else{
            return res.status(500).json({message:'bạn không có quyền xóa Bài viết này'})
        }
    })

router.route('/feel/:typefeel/:idPost/:idUser')
    .get(async(req,res)=>{
        const { typefeel,idPost,idUser } = req.params
        const userAndPost = await USERANDPOST_MODEL.findOne({idPost:idPost})
        const { listUserLike,listUserLove,listUserHaha,listUserSad,listUserWow,listUserAngry,_id } = userAndPost
        if(listUserLike.includes(idUser)){
            let removeUserInListUserLike  = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$pull: {listUserLike:idUser}},{new:true})
            switch (typefeel) {
                case 'like': break
                case 'love': {
                    let addUserToLove   = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLove:idUser}})
                    break;
                }
                case 'haha': {
                    let addUserToHaha   = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserHaha:idUser}})
                    break;
                }
                case 'sad' : {
                    let addUserToSad    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserSad:idUser}})
                    break;
                }
                case 'wow' : {
                    let addUserToWow    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserWow:idUser}})
                    break;
                }
                case 'angry': {
                    let addUserToAngry = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserAngry:idUser}})
                    break;
                }
                default:
                    break;
            } 
        } else if(listUserLove.includes(idUser)){
            let removeUserInListUserLove  = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$pull: {listUserLove:idUser}},{new:true})
            switch (typefeel) {
                case 'like': {
                    let addUserToLke    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLike:idUser}})
                    break
                }
                case 'love': break;
                case 'haha': {
                    let addUserToHaha   = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserHaha:idUser}})
                    break;
                }
                case 'sad' : {
                    let addUserToSad    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserSad:idUser}})
                    break;
                }
                case 'wow' : {
                    let addUserToWow    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserWow:idUser}})
                    break;
                }
                case 'angry': {
                    let addUserToAngry = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserAngry:idUser}})
                    break;
                }
                default:
                    break;
            } 
        } else if(listUserHaha.includes(idUser)){
            let removeUserInListUserHaha  = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$pull: {listUserHaha:idUser}},{new:true})
            switch (typefeel) {
                case 'like': {
                    let addUserToLke    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLike:idUser}})
                    break
                }
                case 'love': {
                    let addUserToLove   = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLove:idUser}})
                    break
                }
                case 'haha': break
                case 'sad' : {
                    let addUserToSad    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserSad:idUser}})
                    break;
                }
                case 'wow' : {
                    let addUserToWow    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserWow:idUser}})
                    break;
                }
                case 'angry': {
                    let addUserToAngry = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserAngry:idUser}})
                    break;
                }
                default:
                    break;
            } 
        } else if(listUserSad.includes(idUser)){
            let removeUserInListUserSad  = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$pull: {listUserSad:idUser}},{new:true})
            switch (typefeel) {
                case 'like': {
                    let addUserToLke    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLike:idUser}})
                    break
                }
                case 'love': {
                    let addUserToLove   = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLove:idUser}})
                    break
                }
                case 'haha': {
                    let addUserToHaha    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserHaha:idUser}})
                    break
                }
                case 'sad' :break
                case 'wow' : {
                    let addUserToWow    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserWow:idUser}})
                    break;
                }
                case 'angry': {
                    let addUserToAngry = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserAngry:idUser}})
                    break;
                }
                default:
                    break;
            } 
        }else if(listUserWow.includes(idUser)){
            let removeUserInListUserWow  = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$pull: {listUserWow:idUser}},{new:true})
            switch (typefeel) {
                case 'like': {
                    let addUserToLke    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLike:idUser}})
                    break
                }
                case 'love': {
                    let addUserToLove   = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLove:idUser}})
                    break
                }
                case 'haha': {
                    let addUserToHaha    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserHaha:idUser}})
                    break
                }
                case 'sad' :{
                    let addUserToSad    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserSad:idUser}})
                    break;
                }
                case 'wow' : break
                case 'angry': {
                    let addUserToAngry = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserAngry:idUser}})
                    break;
                }
                default:
                    break;
            } 
        } else if(listUserAngry.includes(idUser)){
            let removeUserInListUserAngry  = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$pull: {listUserAngry:idUser}},{new:true})
            switch (typefeel) {
                case 'like': {
                    let addUserToLke    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLike:idUser}})
                    break
                }
                case 'love': {
                    let addUserToLove   = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLove:idUser}})
                    break
                }
                case 'haha': {
                    let addUserToHaha    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserHaha:idUser}})
                    break
                }
                case 'sad' :{
                    let addUserToSad    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserSad:idUser}})
                    break;
                }
                case 'wow' : {
                    let addUserToWow    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserWow:idUser}})
                    break;
                }
                case 'angry': break
                default:
                    break;
            }    
        }else{
            switch (typefeel) {
                case 'like': {
                    let addUserToLike   = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLike:idUser}})
                    break
                }
                case 'love': {
                    let addUserToLove   = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserLove:idUser}})
                    break
                }
                case 'haha': {
                    let addUserToHaha    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserHaha:idUser}})
                    break
                }
                case 'sad' :{
                    let addUserToSad    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserSad:idUser}})
                    break;
                }
                case 'wow' : {
                    let addUserToWow    = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserWow:idUser}})
                    break;
                }
                case 'angry': {
                    let addUserToAngry = await USERANDPOST_MODEL.findByIdAndUpdate({_id:_id},{$addToSet:{listUserAngry:idUser}})
                    break;
                }
                default:
                    break;
            }    
        }
        res.redirect('/findlove/newfeed')
    })

router.route('/sharepost/:idPostShare/:idUserShare')
    .get(async(req,res)=>{
        const { idPostShare,idUserShare } = req.params
        const customizeidPost = mongoose.Types.ObjectId(idPostShare);

        const post       = await POST_MODEL.aggregate(
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
            
                    }
                }, 
                { 
                    "$match" : {
                        "posts._id" : customizeidPost
                    }
                }
            ]
            
        );
        
        const createPost = new POST_MODEL({status:'',img:'',idUser:idUserShare,ObjectPostShare:post[0]})
        const savePost   = await createPost.save()
        const newUserandPost  = new USERANDPOST_MODEL({idPost:savePost._id})
        const saveUserandPost = await newUserandPost.save()
        res.redirect('/findlove/newfeed')
    })

router.route('/comment')
    .post(async(req,res)=>{
        const { comment,idPostCmt } = req.body
        const { token }          = session.token
        const dataofuser         = await verifyJWT(token)
        const { id }             = dataofuser.data 
        const userCmt            = await USER_MODEL.findOne({_id:id})
        const { _id,username,avatar } = userCmt
        const createObject     = {"_id":_id,"username":username,"avatar":avatar,"idPost":idPostCmt,"comment":comment}
        const createObjectUserCmt = JSON.parse(JSON.stringify(createObject));
        const updatePost         = await POST_MODEL.update({_id:idPostCmt},{$addToSet:{ObjectComment:createObjectUserCmt}})
        res.redirect('/findlove/newfeed')
    })

exports.POST = router
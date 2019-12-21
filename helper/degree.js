const { USER_MODEL } = require('../model/user.model')
degree = async (user,userSentAddFriend,numberUser) => {
    const { friend:friendOfUser, _id:idOfUser }                  = user
    const { friend:friendOfUserSentAddFriend, _id:idOfUserSent } = userSentAddFriend
    const degreeOfUser     = friendOfUser.length/numberUser
    const degreeOfUserSent = friendOfUserSentAddFriend.length/numberUser
    const updateDegreeOfUser     = await USER_MODEL.findByIdAndUpdate({_id:idOfUser},{$set:{degree:degreeOfUser}})
    const updateDegreeOfUserSent = await USER_MODEL.findByIdAndUpdate({_id:idOfUserSent},{$set:{degree:degreeOfUserSent}})
}

exports.DEGREE = degree
const validate = ({comment, postId}) => {
    let error = {}

    if(!comment){
        error.comment = "Please Provide Comment"
    }
    if(!postId){
        error.postId = "Please Provide PostId"
    }
    return{
        error,
        isValid: Object.keys(error).length === 0
    }
}


module.exports = validate
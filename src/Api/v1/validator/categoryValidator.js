const validate = category => {
    let error = {}
    
    if(!category.category){
        error.category = "Please Provide category"
    }
// if(!category.description){
//         error.description = "Please Provide description"
//     }
    
    return{
        error,
        isValid: Object.keys(error).length === 0
    }
}


module.exports = validate
const validator = require('validator')

const validate = user => {
    let error = {}

    if (!user.name) {
        error.name = 'Please Provide Your Name'
    }
    if (!user.username) {
        error.username = 'Please Provide Your Username'
    }

    if (!user.email) {
        error.email = 'Please Provide Your Email'
    } else if (!validator.isEmail(user.email)) {
        error.email = 'Please Provide a Valid Email'
    }


    return {
        error,
        isValid: Object.keys(error).length === 0
    }
}

module.exports = validate
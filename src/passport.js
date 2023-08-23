const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('./Api/v1/models/User')

const opts = {}
// opts.jwtFromRequest = ExtractJwt.fromHeader("authorization");
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'SECRET';

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (payload, done) => {
        // console.log("payload");
        User.findOne({ _id: payload._id })
            .then(user => {
                // console.log('this is from passport');
                if (!user) {
                    // console.log('this is from passport');
                    return done(null, false) 
                } else {

                    return done(null, user)
                }
            })
            .catch(error => {
                console.log(error)
                return done(error)
            })
    }))
}
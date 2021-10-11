const crypto = require('crypto');

exports.createRandomByte = () => new Promise((resolve, reject) => {
  crypto.randomBytes(30, (err, buf) => {
    if(err) return reject(err);
    const token = buf.toString('hex');
    resolve(token)
  })
})




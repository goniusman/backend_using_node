module.exports = {
   parseData(req, res, next) {
        if (req.method === 'POST') {
            const formData = {}

            req.on('data', data => {
     
                // Decode and parse data
                const parsedData =
                    decodeURIComponent(data).split('&')
     
                for (let data of parsedData) {
     
                    decodedData = decodeURIComponent(
                            data.replace(/\+/g, '%20'))
     
                    const [key, value] =
                            decodedData.split('=')
     
                    // Accumulate submitted
                    // data in an object
                    formData[key] = value
                }
     
                // Attach form data in request object
    console.log(formData);
                req.body = formData
                next()
            })
        } else {
            next()
        }
    }
     
}
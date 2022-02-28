const path = require("path");
const cron = require("node-cron");

module.exports = {
      CronJobs(){  
            cron.schedule('1 * * * * *', function() {
                                    const dirt = path.resolve(".");
                                    const fdate = new Date()
                                    const fully = fdate.getFullYear();
                                    let month = fdate.getMonth()+1;
                                    const date = fdate.getDate()-2;

                                    if(month <= 9){
                                          month = "0" + month
                                    }

                                    fs.unlink(`${dirt}/logs/info/log-${fully}-${month}-${date}.log`, function(err) {
                                          if(err){
                                                console.log('there are no file')
                                          }else{
                                                console.log('successfully deleted logs file')
                                          }
                                    });
            });
      }
}



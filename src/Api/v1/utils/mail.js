const nodemailer = require("nodemailer");

exports.generateOTP = () => {
  var otp = '';
    for (let i = 0; i <= 3; i++) {
      const rand = Math.round(Math.random() * 9);
      otp = otp + rand
    }
    return otp;
}

exports.mailTrap = () => nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "978915cc907530",
      pass: "63377d08045f44"
    }
});

exports.generateHTMLTemplate = code => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style type="text/css">
      @media only screen and (max-width: 620px){
        h1 {
          font-size : 20px;
          padding: 5px;
        }
      }
     
    </style>
  </head>
  <body>
    <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
      <h1 style="background: #f6f6f6; padding: 10px; text-align: center;">We are delighted to welcome you to our team!</h1>
      <p style="width:80px; margin: 0 auto; font-weight: bold; text-align: center; background-color: #f6f6f6; border-radius:5px; font-size: 25px;">${code}</p>
    </div>
  </body>
  </html>
  `
}

exports.plainEmailTemplate = (heading, message) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style type="text/css">
      @media only screen and (max-width: 620px){
        h1 {
          font-size : 20px;
          padding: 5px;
        }
      }
     
    </style>
  </head>
  <body>
    <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
      <h1 style="background: #f6f6f6; padding: 10px; text-align: center;">${heading}</h1>
      <p style="width:80px; margin: 0 auto; font-weight: bold; text-align: center; background-color: #f6f6f6; border-radius:5px; font-size: 25px;">${message}</p>
    </div>
  </body>
  </html>
  `
}


exports.generatePasswordResetTemplate = url => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style type="text/css">
      @media only screen and (max-width: 620px){
        h1 {
          font-size : 20px;
          padding: 5px;
        }
      }
     
    </style>
  </head>
  <body>
    <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
      <h1 style="background: #f6f6f6; padding: 10px; text-align: center;">Please Click the link below to reset your password!</h1>
      <div style="text-align: center">
        <a href="${url}" style="font-family:sans-serif; margin:0 auto; padding:20px; text-align: center;background: #e63946; border-radious: 5px; font-size:20px; color: #fff; cursor:pointer;text-decoration: none;display: inline-block;">Reset Password</a>
      </div>
    </div>
  </body>
  </html> 
  `
}

// exports.plainEmailTemplate = (heading, message) => {
//   return `
//   <!DOCTYPE html>
//   <html lang="en">
//   <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Document</title>
//     <style type="text/css">
//       @media only screen and (max-width: 620px){
//         h1 {
//           font-size : 20px;
//           padding: 5px;
//         }
//       }
     
//     </style>
//   </head>
//   <body>
//     <div style="max-width: 620px; margin: 0 auto; font-family: sans-serif; color: #272727;">
//       <h1 style="background: #f6f6f6; padding: 10px; text-align: center;">${heading}</h1>
//       <p style="width:80px; margin: 0 auto; font-weight: bold; text-align: center; background-color: #f6f6f6; border-radius:5px; font-size: 25px;">${message}</p>
//     </div>
//   </body>
//   </html>
//   `
// }


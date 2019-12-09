module.exports = function(code,email){

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mrpefr@gmail.com',
    pass: process.env.g79
  }
});

var mailOptions = {
  from: 'mrpefr@gmail.com',
  to: email,
  subject: 'code',
  text: 'din kod: '+code
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error.message);
  } else {
    console.log('Email sent: ' + info.response);
  }
});






}
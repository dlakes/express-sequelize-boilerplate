const transporter = require('./mailer').transporter;
const hbs = require('nodemailer-express-handlebars');
require('dotenv').config();

var option = {
    viewEngine : {
        extname: '.hbs', // handlebars extension
        layoutsDir: __dirname+'/views/', // location of handlebars templates
        defaultLayout: 'sendotp1', // name of main template
    },
    viewPath: __dirname+'/views/',
    extName: '.hbs'
};

const sendMail = async options => {

    await transporter.use('compile', hbs(option));

    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: `${options.email}`,
      subject: "OTP Code",
      template: 'sendotp1',
      context: {
        //firstName: `${options.firstname}`,
        code: `${options.code}`,
      }
    };
  
    const info = await transporter.sendMail(message);
    //console.log(info.messageId);
    return info;
}

module.exports = {sendMail}



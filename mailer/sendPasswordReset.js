const transporters = require('./mailer').transporter;
const hbs = require('nodemailer-express-handlebars');
require('dotenv').config();

var options = {
    viewEngine : {
        extname: '.hbs', // handlebars extension
        layoutsDir: __dirname + '/views/', // location of handlebars templates
        defaultLayout: 'passwordreset', // name of main template
    },
    viewPath: __dirname + '/views/',
    extName: '.hbs'
};

const sendPasswordMail = async option => {
   
    await transporters.use('compile', hbs(options));

    const message = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: `${option.email}`,
      subject: "Password Reset",
      template: 'passwordreset',
      context: {
        firstName: `${option.firstname}`,
        code: `${option.code}`,
      }
    };
  
    const info = await transporters.sendMail(message);
    return info;
}

module.exports = {sendPasswordMail}



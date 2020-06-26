const sGMail = require('@sendgrid/mail');

sGMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sGMail.send({
    to: email,
    from: 'varunmisra@gmail.com',
    subject: 'Thanks for joining in',
    text: `Hello ${name}, Thank you for joining in buddy. We look forward to hear your commments about our app.`
  })

}
const sendCancelEmail = (email, name) => {
  sGMail.send({
    to: email,
    from: 'varunmisra@gmail.com',
    subject: 'Sad to see you go',
    text: `Hello ${name}, Very sad to see you go buddy. If you decide to come back at any time, please feel free. `
  })

}

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}
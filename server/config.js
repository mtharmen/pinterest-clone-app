module.exports = {
  IP: process.env.IP || 'localhost',
  PORT: process.env.PORT || '8080',
  mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017',
  jwtSecret: process.env.JWT_SECRET || 'notreallysecret',
  SESSION_SECRET: 'dontellanyone',
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
  CALLBACK_URL: process.env.CALLBACK_URL || 'http://localhost:8080/auth/callback',
  successRedirectUrl: process.env.successRedirectUrl || 'http://localhost:4200',
  failureRedirectUrl: process.env.failureRedirectUrl || 'http://localhost:8080/error',
  imgurEmail: process.env.imgurEmail,
  imgurPassword: process.env.imgurPassword,
  imgurClientID: process.env.imgurClientID,
  admins: process.env.ADMINS || ['admin@test.com']
}

if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'local') {
  require('dotenv').config()
}

module.exports = {
  IP: process.env.IP || 'localhost',
  PORT: process.env.PORT || '8080',
  MONGODB_URL: process.env.MONGODB_URL || 'mongodb://localhost:27017',
  JWT_SECRET: process.env.JWT_SECRET || 'notreallysecret',
  SESSION_SECRET: 'dontellanyone',
  TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
  TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
  CALLBACK_URL: process.env.CALLBACK_URL || 'http://localhost:8080/auth/callback',
  successRedirectUrl: process.env.successRedirectUrl || 'http://localhost:4200',
  failureRedirectUrl: process.env.failureRedirectUrl || 'http://localhost:8080/error',
  IMGUR_CLIENT_ID: process.env.IMGUR_CLIENT_ID,
  IMGUR_CLIENT_SECRET: process.env.IMGUR_CLIENT_SECRET,
  ADMINS: process.env.ADMINS || ['admin@test.com']
}

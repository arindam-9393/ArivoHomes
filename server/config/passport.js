const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // ✅ FIX: Changes callback URL automatically based on environment
      callbackURL: process.env.NODE_ENV === 'production' 
        ? "https://arivohomes-api.onrender.com/auth/google/callback" 
        : "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (user) {
            return done(null, user);
        } else {
            const randomPassword = Math.random().toString(36).slice(-8);
            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                photo: profile.photos[0].value,
                password: randomPassword,
                provider: 'google',
                isVerified: true,
                role: 'tenant'
            });
            return done(null, user);
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
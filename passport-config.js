const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require("fs");

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email);
    if (user == null) {
      return done(null, false, { message: 'No user with that email' });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        // Generate JWT token
        let token = jwt.sign({ name: user }, "TOP_SECRET");
        console.log(token);
        
        // Store token in a file (This is just for demonstration, in real-world scenarios, tokens should be stored securely)
        fs.writeFile(
          "fakeLocal.json",
          JSON.stringify({ Authorization: `Bearer ${token}` }),
          (err) => {
            if (err) throw err;
          }
        );
        
        // Return user if authentication succeeds
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  }

  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id));
  });
}

module.exports = initialize;

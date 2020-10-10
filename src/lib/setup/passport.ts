// Requires
import bcrypt from "bcryptjs";
import cookieSession from "cookie-session";
import { Express } from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import User from "../../models/user-model";

// Functions
const setup = () => {
  passport.use(
    new LocalStrategy.Strategy({ usernameField: "email" }, (email, password, done) => {
      // Match user
      User.findOne({ email }).then(user => {
        if (!user) {
          return done(null, false);
        }
        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};

const configure = (app: Express, secret: string) => {
  // Cookie session
  app.use(cookieSession({ secret }));
  // Passport
  setup();
  app.use(passport.initialize());
  app.use(passport.session());
};

export = { configure };
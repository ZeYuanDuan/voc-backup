const db = require("../models");
const Vocabulary = db.Vocabulary;

const passport = require("passport");

const authControllers = {
  postLogin: async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      return req.login(user, async (err) => {
        if (err) {
          return next(err);
        }
        try {
          const { name, id } = user;
          const message = info.message;
          const vocStorage = await Vocabulary.count({
            where: { UserId: id },
          });
          return res.json({ message, name, vocStorage });
        } catch (err) {
          next(err);
        }
      });
    })(req, res, next);
  },

  postLogout: (req, res) => {
    req.logout((error) => {
      if (error) {
        return next(error);
      }
      return res.status(200).json({ message: "登出成功" });
    });
  },
};

module.exports = authControllers;
const db = require("../models");
const Vocabulary = db.Vocabulary;
const User = db.User;

const passport = require("passport");

const authControllers = {
  postLogin: async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
    })
    passport.authenticate("local", (err, user, info) => {
      console.log("本地驗證過程存的東西：", user); // 測試用
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
          const message = info.message;
          const { id, name } = await User.findByPk(user.userId);
          const vocStorage = await Vocabulary.count({
            where: { userId: id },
          });
          const isAuthenticated = req.isAuthenticated();
          return res.json({ message, name, vocStorage, isAuthenticated });
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
      const isAuthenticated = req.isAuthenticated();
      return res.status(200).json({ message: "登出成功", isAuthenticated });
    });
  },

  getGoogleAuth: passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),

  getGoogleAuthCallback: async (req, res, next) => {
    passport.authenticate("google", (err, user, info) => {
      console.log("Google 驗證過程存的東西：", user); // 測試用
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
          const message = info.message;
          const { id, name } = await User.findByPk(user.userId);
          console.log("用來找單字的 id：", id, name) // 測試用
          const vocStorage = await Vocabulary.count({
            where: { userId: id },
          });
          const isAuthenticated = req.isAuthenticated();
          return res.json({ message, name, vocStorage, isAuthenticated });
        } catch (err) {
          next(err);
        }
      });
    })(req, res, next);
  },
};

module.exports = authControllers;
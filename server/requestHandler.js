const users = require('./people.json');

exports.loginHandler = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  let targetUser = null;

  users.forEach( user => {
    if (user.username === username) {
      targetUser = user;
    }
  });

  if (targetUser) {
    if (password === targetUser.password) {
      req.session.user = username;
      req.session.isDoctor = targetUser.isDoctor;
      
      res.send({
        authenticated: true,
        isDoctor: req.session.isDoctor
      });
    } else {
      res.send({
        authenticated: false,
        message: 'Wrong password'
      });
    }
  } else {
    res.send({
      authenticated: false,
      message: 'User does not exist'
    });
  }
};

// Destroys the session when the user logs out
exports.logoutHandler = (req, res) => {
  req.session.destroy();
};

// For react router to protect routes
exports.authenticateHandler = (req, res) => {
  if (req.session.user && req.session.isDoctor) {
    res.send({
      authenticated: true,
      isDoctor: true
    });
  } else if (req.session.user && !req.session.isDoctor) {
    res.send({
      authenticated: true,
      isDoctor: false
    });
  } else {
    res.send({
      authenticated: false,
      isDoctor: false
    });
  }
};
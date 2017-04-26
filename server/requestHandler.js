const users = require('./people.json');

exports.loginHandler = (req, res) => {

};

exports.logoutHandler = (req, res) => {
  req.session.destroy( () => res.redirect('/login') );
};
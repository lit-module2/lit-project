function isLoggedIn (req, res, next) {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

function isUserLoggedIn (req, res, next) {
    if (req.session.currentUser && req.session.currentUser.role === 'user') {
        next();
    } else {
        res.redirect('/auth/login');
    }
}

function isAdminLoggedIn (req, res, next) {
    if (req.session.currentUser && req.session.currentUser.role === 'admin') {
        next()
    } else {
        res.redirect('/auth/login')
    }
}

module.exports = {
    isLoggedIn,
    isUserLoggedIn,
    isAdminLoggedIn
};  
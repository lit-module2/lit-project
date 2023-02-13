function isLoggedIn (req, res, next) {
    if (req.session.currentUser) {
        next();
    } else {
        res.redirect('/auth');
    }
}

function isUserLoggedIn (req, res, next) {
    if (req.session.currentUser && req.session.currentUser.role === 'user') {
        next();
    } else {
        res.redirect('/auth');
    }
}

function isAdminLoggedIn (req, res, next) {
    if (req.session.currentUser && req.session.currentUser.role === 'admin') {
        next()
    } else {
        res.redirect('/')
    }
}

module.exports = {
    isLoggedIn,
    isUserLoggedIn,
    isAdminLoggedIn
};  
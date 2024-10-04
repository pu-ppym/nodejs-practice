const checkLogin = () => {

};

const alertAndGo = (res, msg, url) => {
    res.render('common/alert', {msg, url})
}

module.exports = {
    checkLogin,
    alertAndGo
}
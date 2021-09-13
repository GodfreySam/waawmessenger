module.exports = function(req, res, next) {
	if (!req.user) return console.log('no user access');
	next();
};

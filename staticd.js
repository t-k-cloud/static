var express = require('express');
var path = require('path');
var expAuth = require('../auth/express-auth.js');
var app = express();

const port = 8961;
const srv_dir = '/home/tk/master-tree';

expAuth.init(app, {
	loginRoute: '/auth/login',
	verifyUrl: 'http://localhost/auth/token_verify',
	keyName: 'tk-auth'
});

var auth_middleware = expAuth.middleware;

app.use((req, res, next) => {
	const fname = path.basename(req.path);
	if (null === fname.match(/^pub-/)) {
		console.log("[private file] " + fname);
		auth_middleware(req, res, next);
	} else {
		console.log("[public file] " + fname);
		next();
	}
});

app.use(express.static(srv_dir));

app.get('/', function (req, res) {
	res.sendFile(path.resolve('./README.md'));
});

console.log('listening at port ' + port);
app.listen(port);

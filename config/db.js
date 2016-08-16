const mongojs = require('mongojs');

var collections = ['entities','companies','roles','tokens'];
var url='mongodb://databaseuser:databasepassword@ds019480.mlab.com:19480/databaseall';
const db=mongojs(url, collections);

module.exports = {
	'url' : url,
	'db':db
}


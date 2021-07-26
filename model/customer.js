var db = require('../config/database');
var Schema = db.Schema;

module.exports = db.model('Customer', Schema({
    _id: { type: Schema.Types.ObjectId, auto: true},
    name: String,
    address: String,
    location: String,
    phone:  String,
    email: String,
    status : { type: Number, default: 1 },
    created_at: { type: Date, default: new Date() },
}));
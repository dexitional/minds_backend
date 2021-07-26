var db = require('../config/database');
var Schema = db.Schema;

module.exports = db.model('Category', Schema({
    _id: { type: Schema.Types.ObjectId, auto: true},
    title: { type: String, required: true },
    description: String,
    status: { type: Number, default: 1 },

}));
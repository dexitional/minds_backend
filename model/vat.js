var db = require('../config/database');
var Schema = db.Schema;

module.exports = db.model('Vat', Schema({
    _id:  { type: Schema.Types.ObjectId, auto: true},
    rate: { type: String, default: '0' },
    description: String,
    status: { type: Number, default: 1 },

}));
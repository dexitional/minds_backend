var db = require('../config/database');
var Schema = db.Schema;
var moment = require('moment');

module.exports = db.model('Request', Schema({
    _id: { type: Schema.Types.ObjectId, auto: true},
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    rid: { type: Number }, // Request ID
    oid: { type: Number }, // Order or Sales ID
    quantity: { type: Number, default: 0 },
    user : { type: String, required: true },
    receiver : { type: String, required: true },
    messenger : { type: String },
    status : { type: Number, default: 1 },
    created_at: { type: Date, default: new Date() },
    timestamp : { type: String, default: moment().format('LLL') }
}));
var db = require('../config/database');
var Schema = db.Schema;
var moment = require('moment');

module.exports = db.model('Product', Schema({
    _id: { type: Schema.Types.ObjectId, auto: true},
    vat: { type: Schema.Types.ObjectId, ref: 'Vat' },
    category: { type: Schema.Types.ObjectId, ref: 'Category'},
    title: { type: String, unique: true, required: true },
    description: String,
    sku: String,
    price:  { type: Number, default: 0.0 },
    cprice: { type: Number, default: 0.0 },
    quantity: { type: Number, default: 0 },
    min_quantity : { type: Number, default: 0 },
    status : { type: Number, default: 1 },
    created_at: { type: Date, default: new Date() },
    timestamp : { type: String, default: moment().format('LLL') }
}));
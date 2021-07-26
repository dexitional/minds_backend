var db = require('../config/database');
var Schema = db.Schema;
var moment = require('moment');

module.exports = db.model('Restock', Schema({
    _id: { type: Schema.Types.ObjectId, auto: true},
    product:  { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    price:    { type: Number, default: 0.0 },
    cprice:   { type: Number, default: 0.0 },
    quantity: { type: Number, default: 0.0 },
    supplier: String,
    action:   { type: Number, default: 0 }, // Order approval status thus ( 1 - Loaded , 0 = Not Loaded )
    created_at: { type: Date, default: new Date() }, // Period of Order creation
    timestamp : { type: String, default: moment().format('LLL') }

}));
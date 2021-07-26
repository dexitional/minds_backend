var db = require('../config/database');
var Schema = db.Schema;
var moment = require('moment');

module.exports = db.model('Transaction', Schema({
    _id:  { type: Schema.Types.ObjectId, auto: true},
    order: {  type: Schema.Types.ObjectId, ref: 'Order', required: true }, // Order attached to transaction
    tid: {  type: String, required: true }, // Order attached to transaction
    user: { type: String, required: true }, // Who received payment
    amount_charge: { type: Number, default: 0.0  }, // Order amount with tax and discount inclusive
    amount_paid: { type: Number, default: 0.0  }, // Amount paid by customer
    amount_bal: { type: Number, default: 0.0  },  // Balance released to customer
    paymode: {type: String, enum : ['cash','credit','check'], default:'cash'}, // Mode of Payment
    status: { type: Number, default: 1 }, // Completed status
    created_at: { type: Date, default: new Date() }, // Time of Payment
    timestamp : { type: String, default: moment().format('LLL') }

}));
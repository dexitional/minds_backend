var db = require('../config/database');
var Schema = db.Schema;

module.exports = db.model('Cart', Schema({
    _id: { type: Schema.Types.ObjectId, auto: true},
    order: { type: Schema.Types.ObjectId, ref: 'Order' },
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    price: { type: Number, default: 0 },
    amount: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    quantity: { type: Number, default: 0 },

}));
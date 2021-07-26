var db = require('../config/database');
var Schema = db.Schema;
var moment = require('moment');

module.exports = db.model('Order', Schema({
    _id: { type: Schema.Types.ObjectId, auto: true},
    user: { type: String, required: true }, // Sales person placing order on behalf of customer
    oid: Number,  // Order ID for Invoicing
    amount: Number,  // Amount of order without discounts
    discount: Number, // Total discounts on products
    tax: Number, // Total tax on all items in order
    refname: String, // Reference Person & Address
    refphone: String, // Reference Person Phone
    ordertype: { type: String, enum : ['credit','normal'], default: 'normal' }, // Order type [ Credit purchase = credit, Normal purchase = normal ]
    approval: { type: Number, default: 0 }, // Order approval status thus ( 1 - approved for release to customer, 0 = pending, 2 = rejected )
    completed: { type: Number, default: 0 }, // Order Completed status thus ( 1 - completed, 0 = in-progress, 2 = order saved for later processing )
    created_at: { type: Date, default: new Date() }, // Period of Order creation
    timestamp : { type: String, default: moment().format('LLL') }

}));
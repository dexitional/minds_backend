var db = require('../config/database');
var Schema = db.Schema;
var moment = require('moment');

module.exports = db.model('Log', Schema({
    _id: { type: Schema.Types.ObjectId, auto: true},
    action:  { type: String, required: true },
    meta: { type: Object },
    user: { type: String },
    created_at: { type: Date, default: new Date()},
    timestamp : { type: String, default: moment().format('LLL') }
}));


/*
  ACTION TYPES
  - LOGIN_SUCCESS
  - LOGIN_FAILED
  - PRODUCT_CREATED
  - PRODUCT_UPDATED
  - PRODUCT_DELETED
  - STOCK_ADDED
  - STOCK_LOADED
  - STOCK_EDITTED
  - STOCK_DELETED
  - SALE_CREATED
  - SALE_UPDATED
  - ITEM_REDUCED
  - ITEM_INCREASED
  - PRICE_UPDATED
*/
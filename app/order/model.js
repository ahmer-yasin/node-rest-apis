'use strict';

module.exports = function (app, db, scope) {
    var _Schema = db.Schema,
        orderStatusEnums = ['hold', 'process', 'deliver', 'cancel'],
        ITEMSCHEMA = {
            product_id: {
                type: _Schema.ObjectId,
                required: true
            },
            title: {type: String},
            unit: {
                type: String
            },
            quantity:{
                type: Number
            },
            price: {
                type: Number,
                default: 0
            }
            
        },
        _orderSchema = new _Schema({
            order_status:{
                type: String,
                index: true,
                trim: true,
                enum: orderStatusEnums,
                default: 'hold'
            },
            total: {
                type : Number,
                index: true,
                default: 0
            },
            items:[ITEMSCHEMA],
            vendee: { // only contain customer id
                type: _Schema.ObjectId,
                required: true
            },
            vendor:{
                type: _Schema.ObjectId,
                required: true,
                ref: 'Organization'
            },
            dropAddress: {
                type: String,
                index: true,
                trim: true
            },
            dropLocation: {
                type: { 
                    type: String, 
                    default: 'Point' 
                },
                coordinates: {
                    type: [Number],
                    default: [0, 0]
                }
            },
            is_deleted:{
                type: Boolean,
                default: false
            }
        }, { timestamps: true });


    var _Order = db.model(scope.collectionName, _orderSchema);
    db[scope.collectionName] = _Order;

};
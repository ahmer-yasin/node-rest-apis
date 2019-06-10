'use strict';

module.exports = function (app, db, scope) {
    var _Schema = db.Schema,
        _inventorySchema = new _Schema({
            title:{
                type: String,
                index: true,
                trim: true,
                required: true   
            },
            description: {
                type: String,
                index: true,
                trim: true
            },
            category:{
                type: String,
                index: true
            },
            image:{
                type: String,
                index: true,
                default: "https://www.deif.com/dist/images/product-placeholder-202x153.png"
            },
            unit:{
                type: String,
                index: true
            },
            created_by_store: {
                type: _Schema.ObjectId,
                required: true,
                ref: 'Organization'
            },
            created_by:{
                type: _Schema.ObjectId,
                required: true,
                ref: 'User'
            },
            price: {
                type: Number,
                default: 0
            },
            is_deleted:{
                type: Boolean,
                default: false
            }
        }, { timestamps: true });


    var _DB = db.model(scope.collectionName, _inventorySchema);
    db[scope.collectionName] = _DB;

};
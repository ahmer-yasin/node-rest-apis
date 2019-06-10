'use strict';

module.exports = function (app, db, scope) {
    var _Schema = db.Schema,
        _ProductSchema = new _Schema({
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
            is_deleted: {
                type: Boolean,
                default: false,
            }
        }, { timestamps: true });
    

    var _Product = db.model(scope.collectionName, _ProductSchema);
    db[scope.collectionName] = _Product;

};


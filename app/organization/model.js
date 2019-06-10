'use strict';

module.exports = function (app, db, scope) {
    var _Schema = db.Schema,
        _organizationSchema = new _Schema({
            name: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            latlng: {
                type: { 
                    type: String, 
                    default: 'Point' 
                },
                coordinates: {
                    type: [Number],
                    default: [0, 0]
                }
            },
            type: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            city: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            country: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            state: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            logo: {
                type: String,
                index: true,
                trim: true,
                required: true
            }, 
            owner_id: {
                type: String,
                index: true,
                trim: true,
                required: true
            },
            created_by:{
                type: String,
                index: true,
                trim: true,
                required: true
            },
            is_deleted: {
                type: Boolean,
                default: false,
            }

        }, { timestamps: true });


    var _organizationSchema = db.model(scope.collectionName, _organizationSchema);
    db[scope.collectionName] = _organizationSchema;

};
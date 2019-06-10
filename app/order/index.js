
'use strict';
module.exports = function (db, app, router) {
    var scope = {
        services: {},
        controllers: {},
        collectionName: "Order"
    };
    require('./model')(app, db, scope);
    require('./service')(app, scope);
    require('./controller')(app, scope);
    require('./routes')(app, router, scope);
}

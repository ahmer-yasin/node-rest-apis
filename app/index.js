
'use strict';
module.exports = function (db, app, router) {
    require('./_common')(app,db);
    require('./user')(db, app, router);
    require('./organization')(db, app, router);
    require('./product')(db, app, router);
    require('./category')(db, app, router);
    require('./inventory')(db, app, router);
    require('./order')(db, app, router);
}

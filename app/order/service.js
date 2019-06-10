'use strict';
module.exports = function(app, scope) {
  // Here you can write your services.
  // For keep controller clean.


  scope.services._searchItem = function(_query, _requesting_fields, cb) {
    if (_query && cb && typeof cb == 'function') {
      _query.is_deleted = false;

      app.services.findOne({ owner_id: _query.user}, '_id', 'Organization', function(error, organization) {
        console.log(organization);
        if (error == null && organization && organization._id) {
          delete _query.user;
          _query.vendor = organization._id;
          app.services._filterItems(_query, _requesting_fields, scope.collectionName, function(error_filterItems, success_filterItems) {
            if (error_filterItems == null) {
              cb(null, success_filterItems);
            } else {
              cb(error_filterItems, null);
            }
          });
        }else{
          cb("Organization Not Found", null);
        }
      });

    } else {
      cb("Method Error", null)
    }
  }


};
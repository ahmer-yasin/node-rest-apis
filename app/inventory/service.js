'use strict';
module.exports = function (app, scope) {
  // Here you can write your services.
  // For keep controller clean.

  
  scope.services._searchItem = function (_query, _requesting_fields, cb) {
    if (_query && cb && typeof cb == 'function') {
      if (_query.title && _query.title.length>0) {
        _query.title = new RegExp(_query.title, "i");
      }
      if (_query.limit) {
        _query.limit = Number(_query.limit);
      }
      if (_query.page) {
        _query.page = Number(_query.page) - 1;
      }
      app.services._filterItems(_query, _requesting_fields, scope.collectionName, function (error_filterItems, success_filterItems) {
        if (error_filterItems == null) {
          cb(null, success_filterItems);
        } else {
          cb(error_filterItems, null);
        }
      })
    } else {
      cb("Method Error", null)
    }
  }

  scope.services._getOrganizationID = function(user_id, cb){
    if(user_id){
      app.services.findOne({
        owner_id: user_id
      },'_id', "Organization", function(error, organization){
        if(error){
          cb(error, null);
        }else{
          cb(null, organization);
        }
      });
    }else{
      cb("Method Error", null);
    }
  }

};

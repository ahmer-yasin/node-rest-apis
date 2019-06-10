'use strict';

module.exports = function(app,router, scope){


  router.route('/order/:id?')
    .post(app.services._authorization, scope.controllers._createItem)
    .get(app.services._authorization, scope.controllers._searchItems)
    .put(app.services._authorization, scope.controllers._updateItem)
    .delete(app.services._authorization, scope.controllers._deleteItem);

  router.route('/order/refreshprice/:id?')
  	.get(app.services._authorization, scope.controllers._refreshPrice);
  

};
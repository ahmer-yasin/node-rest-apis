'use strict';
module.exports = function(app, scope) {


  // Create item Controller
  scope.controllers._createItem = function(req, res) {
    var _requestData = req.body,
      requireDate = ['items', 'vendor'],
      responseFileds = ['_id', 'items', 'dropAddress', 'dropLocation', 'vendor', 'vendee'],
      allowFields = {
        items: 'object',
        vendor: 'string',
        address: 'string',
        deliveryLocation: 'object'
      };

    if (req.user.role == 'customer') {
      // Check Require Fields
      var query = app.services._onlyAllow(allowFields, _requestData);
      app.services._checkRequire(query, requireDate, function(error) {
        if (error == false) {
          _requestData.vendee = req.user._id;
          // Create Order
          app.services._createItem(_requestData, scope.collectionName, function(error_createItem, success_createItem) {
            if (error_createItem == null) {
              return res.status(200).send({
                code: 200,
                success: true,
                message: 'Successfully Create Item',
                data: app.services._successResponse(success_createItem, responseFileds)
              });
            } else {
              return res.status(503).send({
                code: 503,
                success: false,
                error: error_createItem,
                message: "Error On Create Item"
              });
            }
          });
        } else {
          return res.status(error.code).send(error);
        }
      });
    } else {
      return res.status(405).send({
        code: 405,
        success: false,
        message: "Method not allowed"
      });
    }
  }

  // Search item controller
  scope.controllers._searchItems = function(req, res) {
    var _requestingQuery = req.query,
      allowFields = {
        limit: 'number',
        start: 'number'
      },
      requireDate = ['vendor'],
      query = app.services._onlyAllow(allowFields, _requestingQuery);
    query.user = req.user.id;
    scope.services._searchItem(query, '_id dropAddress vendee total order_status', function(error, categories) {
      if (error == null) {
        res.status(200).send({
          code: 200,
          success: true,
          message: "Successfully Retrieve Items",
          data: categories
        });
      } else {
        res.status(504).send({
          code: 504,
          succes: false,
          message: "Error On Retrieving Items",
          error: error
        });
      }
    });

  }

  // Update Item controller
  scope.controllers._updateItem = function(req, res) {
    if (req.params.id) {
      // need to add validation in body if data is not acceptable send an error invalid data and also check special characters in string;
      var updateObject = req.body,
        responseFileds = ['title', '_id'],
        allowFields = {
          title: 'string'
        }
        //delete updateObject._id;
      var requestData = app.services._onlyAllow(allowFields, updateObject);
      // Check item already exist
      app.services._checkExist({
        title: requestData.title
      }, scope.collectionName, function(error_checkExist, isExist) {
        if (error_checkExist == null) {
          if (!isExist) {
            // If item not exist then update
            app.services._findAndUpdate({
              _id: req.params.id
            }, requestData, scope.collectionName, function(error_update, succes_update) {
              if (error_update == null) {
                res.status(200).send({
                  code: 200,
                  succes: true,
                  message: "Succssfully update item",
                  data: app.services._successResponse(succes_update, responseFileds)
                });
              } else {
                res.status(503).send({
                  code: 503,
                  succes: false,
                  message: "Unable to update item",
                  error: error_update
                });
              }
            });
          } else {
            res.status(409).send({
              code: 409,
              succes: false,
              message: "Duplicate Not Allowed",
            });
          }
        } else {
          res.status(503).send({
            code: 503,
            succes: false,
            message: "Unable to update item",
            error: error_update
          });
        }
      });

    } else {
      res.status(404).send({
        code: 404,
        succes: false,
        message: "Invalid Item ID",
      });
    }
  }

  // Remove item controller
  scope.controllers._deleteItem = function(req, res) {
    if (req.params.id) {
      app.services._findAndUpdate({
        _id: req.params.id,

      }, {
        isDeleted: true
      }, scope.collectionName, function(error_findAndUpdate, succes_findAndUpdate) {
        if (error_findAndUpdate == null) {
          res.status(200)
            .send({
              code: 200,
              succes: true,
              message: "Successfully Delete item",
            });
        }
      });
    }
  }

  // Refresh Order
  scope.controllers._refreshPrice = function(req, res) {
    if (req.params.id) {
      var orderID = req.params.id;
      app.services.findOne({
        _id: orderID
      }, 'items', 'Order', function(error, orders) {
        orders.forEach
        return res.status(200).send({
          code: 200,
          succes: true,
          message: "Successfully fetch orders",
          data: orders
        })
      });
    } else {
      return res.status(404).send({
        code: 404,
        succes: false,
        message: "Invalid parameters"
      });
    }
  }

};
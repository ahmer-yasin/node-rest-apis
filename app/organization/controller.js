'use strict';
module.exports = function (app, scope) {
  
  // Create item Controller
  scope.controllers._createItem = function (req, res) {
    var _requestData = req.body,
      requireDate = ['name', 'type', 'address', 'city', 'country', 'state', 'logo', 'owner_id'], // All the requie fields will here
      responseFields = ['name', 'type', 'city', 'country', 'state', 'logo', 'owner_id', '_id', 'latlng']; // One these fields will show in response
    app.services._checkRequire(_requestData, requireDate, function (error) {
      if (error == false) {
        app.services._checkExist({ name: _requestData.name }, scope.collectionName, function (error_checkExist, isExist) {
          if (error_checkExist == null) {
            if (!isExist) {
              _requestData.created_by = req.user._id;
              app.services._createItem(_requestData, scope.collectionName, function (error_createItem, success_createItem) {
                if (error_createItem == null) {
                  res.status(200).send({
                    code: 200,
                    success: true,
                    message: 'Successfully Create Item',
                    data: app.services._successResponse(success_createItem, responseFields)
                  });
                } else {
                  res.status(503).send({
                    code: 503,
                    success: false,
                    error: error_createItem,
                    message: "Error On Create Item"
                  });
                }
              });
            } else {
              res.status(409).send({
                code: 409,
                success: false,
                message: "Duplicate title required Unique"
              });
            }
          } else {
            res.status(503).send({
              code: 503,
              success: false,
              message: "Forbidden"
            });
          }
        });
      } else {
        res.status(error.code).send(error);
      }
    });
  }

  // Search item controller
  scope.controllers._searchItems = function (req, res) {
    var _requestingQuery = req.query, _requisition_fields = "_id name latlng type logo";
    scope.services._searchItem(_requestingQuery, _requisition_fields, function (error, items) {
      if (error == null) {
        res.status(200).send({
          code: 200,
          success: true,
          message: "Successfully Retrieve Items",
          data: items.rows,
          page:  items.page,
          totalPages: items.totalPages,
          limit: items.limit,
          count: items.count,
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
  scope.controllers._updateItem = function (req, res) {
    if (req.params.id) {
      var updateObject = req.body,
        responseFileds = ['title', '_id'];
      delete updateObject._id;

      app.services._findAndUpdate({_id: req.params.id},updateObject, scope.collectionName, function(error_update, succes_update){
        if(error_update == null){
          res.status(200).send({
            code: 200,
            succes: true,
            message: "Succssfully update item",
            data: app.services._successResponse(succes_update, responseFileds)
          })
        }else{
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
  scope.controllers._deleteItem = function(req, res){
    if(req.params.id){
      app.services._findAndUpdate({
        _id: req.params.id,
        
      },{isDeleted: true}, scope.collectionName, function(error_findAndUpdate, succes_findAndUpdate){
        if(error_findAndUpdate == null){
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
};

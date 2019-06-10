'use strict';
module.exports = function(app, scope) {


  // Create item Controller
  scope.controllers._createItem = function(req, res) {
    var _requestData = req.body,
      requireDate = ['title', 'unit'],
      responseFileds = ['title', 'unit', '_id'];

    // Check require fields
    app.services._checkRequire(_requestData, requireDate, function(error) {
      if (error == false) {
        var _userID;
        _requestData.created_by = req.user._id;
        if (req.user.role == 'shop_owner') {
          _userID = req.user.id;
        } else if (req.user.role == 'admin') {
          _userID = _requestData.shop_owner;
        }


        if (_userID) {
          // Fetching organization information
          scope.services._getOrganizationID(_userID, function(error, organization) {
            if (organization && organization.id) {
              // check if the item exists
              var _checkExistQuery = { title: _requestData.title, created_by_store: organization.id };
              app.services._checkExist(_checkExistQuery, scope.collectionName, function(error_checkExist, isExist) {
                if (error_checkExist == null) {
                  
                  _requestData.created_by_store = organization.id;
                  if (!isExist) {
                    app.services._createItem(_requestData, scope.collectionName, function(error_createItem, success_createItem) {
                      if (error_createItem == null) {
                        res.status(200).send({
                          code: 200,
                          success: true,
                          message: 'Successfully Create Item',
                          data: app.services._successResponse(success_createItem, responseFileds)
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
                      succes: false,
                      message: "You cannot create item already exist"
                    });
                  }
                }
              });
            } else {
              res.status(404).send({
                code: 404,
                success: false,
                message: "No organization found, first create organization then you can add inventory"
              });
            }
          });
        } else {
          res.status(404).send({
            code: 404,
            succes: false,
            message: "Not allowed to create product"
          });
        }
      } else {
        res.status(error.code).send(error);
      }
    });
  }

  // Search item controller
  scope.controllers._searchItems = function(req, res) {
    var _requestingQuery = req.query,
      allowFields = {
        limit: 'string',
        page:  'string',
        start: 'number',
        title: 'string',
        created_by_store: 'string',
        is_deleted: 'boolean'
      },_responseFields;

    if(req.user.role == 'admin'){
      _responseFields = '_id title category image unit created_by_store is_deleted description';
    }else if(req.user.role == 'shop_owner' && _requestingQuery.store){
      _requestingQuery.created_by_store = _requestingQuery.store;
      _responseFields = '_id title category image unit description';
      _requestingQuery.is_deleted = false;
    }else if(req.user.role == 'customer' && _requestingQuery.store){
      _requestingQuery.created_by_store = _requestingQuery.store;
      _responseFields = '_id title category image unit description';
      _requestingQuery.is_deleted = false;
    }else{
      return res.status(405).send({
        code: 405,
        success: false,
        message: "Method not allowed"
      });
    }

    var query = app.services._onlyAllow(allowFields, _requestingQuery);
    scope.services._searchItem(query, _responseFields, function(error, categories) {
      if (error == null) {
        res.status(200).send({
          code: 200,
          success: true,
          message: "Successfully Retrieve Items",
          data:  categories.rows,
          page:  categories.page,
          totalPages: categories.totalPages,
          limit: categories.limit,
          count: categories.count
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
          title: 'string',
          unit: 'string',
          category: 'string',
          image: 'string'
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
        _id: req.params.id
      }, {
        is_deleted: true
      }, scope.collectionName, function(error_findAndUpdate, succes_findAndUpdate) {
        if (error_findAndUpdate == null) {
          res.status(200)
            .send({
              code: 200,
              succes: true,
              message: "Successfully Delete item",
              data: succes_findAndUpdate
            });
        }
      });
    }
  }

};
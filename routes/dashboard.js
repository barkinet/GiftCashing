/*jslint node: true */
'use strict';

const
  express = require('express'),
  router = express.Router({
    mergeParams: true
  }),
  User = require('../models/user'),
  Gift = require('../models/gift'),
  middleware = require('../middleware');

router.get(
  '/gifts',
  middleware.isLoggedIn,
  (req, res) => {
    let query = {};
    
    switch(req.query.filter) {
      case 'received' :
        query = {
          user: req.user._id,
          'status.review': true
        };
        break;
      case 'declined' :
        query = {
          user: req.user._id,
          'status.declined': true
        };
        break;
      case 'accepted-redeemed' :
        query = {
          user: req.user._id,
          'status.accepted': true
        };
        break;
      case 'paid' :
        query = {
          user: req.user._id,
          'status.paid': true
        };
        break;
    }
    
    Gift
      .find(query)
      .populate('user')
      .exec((err, gifts) => {
        if(err) {
          req.flash('error', err.message);
          gifts = [];
        }
        
        if(req.query.filter === 'received') {
          res.render('dashboard/gifts/index', {
            title: 'Received Gifts',
            breadcrumbsName: 'Received',
            gifts: gifts
          });
        }
  
        if(req.query.filter === 'accepted' || 'declined' || 'paid') {
          res.render('dashboard/gifts/other', {
            title: req.query.filter,
            breadcrumbsName: req.query.filter,
            gifts: gifts
          });
        }
        
      });
  });


router.put(
  '/gifts/:id/:status',
  middleware.isLoggedIn,
  (req, res) => {
    let _id = req.params.id;
    let status = req.params.status;
    let message = req.body.message;
    
    // TODO fix exception error
    if(req.user.preferredPaymentMethod.length === 0) {
      return res.status(404).send({
        success: false,
        err: 'Please set your preferred payment method.'
      });
    } else {
      Gift
        .findOne({
          _id,
          user: req.user._id
        })
        .exec((err, gift) => {
          if(err) {
            req.flash('error', err.message);
            req.redirect('back');
          }
          
          if(!gift) {
            return res.status(404).send({
              success: false,
              err: 'No gift found'
            });
          }
          
          for(let status in gift.status) {
            gift.status[status] = false;
          }
          gift.status[status] = true;
          
          Gift
            .update(
              {_id},
              {
                $set: {
                  status: gift.status,
                  acceptedGiftMessage: message
                }
              },
              (err, result) => {
                if(err) {
                  return res.status(500).send({
                    success: false,
                    err: err.message
                  });
                }
                
                res.status(200).send({
                  success: true,
                  result
                });
              });
        });
    }
    
  });


router.get(
  '/share',
  middleware.isLoggedIn,
  (req, res) => {
    User
      .findOne({_id: req.user.id}, (err, user) => {
        if(err) {
          req.flash('error', err.message);
        }
        
        res.render('dashboard/share/index', {
          title: 'Share Gifts',
          breadcrumbsName: 'Share'
        });
      });
  });


router.put(
  '/gift/declined/:gift_id',
  middleware.isLoggedIn,
  function (req, res){    

    let status = {
      'paid': false,
      'declined': true,
      'redeemed': false,
      'accepted': false,
      'review': false
    };

    let gift = {
      status: status,
      changedStatusDate: new Date()
    };

     Gift
      .findByIdAndUpdate(
        req.params.gift_id,
        gift,
        (err) => {
          if (err) {
            console.log('Error:', err);
            return res.status(500).send({
              success: false,
              error: 'Error, contact support'
            });
          }
  
          // req.flash('success', 'Gift has been declined successfully.');
          // eval(locus);
          res.redirect('back');
    });

});

module.exports = router;
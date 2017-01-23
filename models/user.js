/*jshint esversion: 6 */
const
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Types = Schema.Types,
  passportLocalMongoose = require('passport-local-mongoose');

const paymentPreference = {
    paypalEmail:Types.String,
    check: {
      addressLine1: Types.String,
      addressLine2: Types.String,
      city: Types.String,
      state: Types.String,
      zipCode: Types.String
    }
};

const UserSchema = new mongoose.Schema({
  firstName: {
    type: Types.String,
    required: true
  },
  lastName: {
    type: Types.String,
    required: true
  },
  aliasFirstName: {
    type: Types.String,
    unique: true
  },
  aliasLastName: {
    type: Types.String,
    unique: true
  },
  username: {
    type: Types.String,
    unique: true,
    required: true
  },
  phone: Types.String,
  password: Types.String,
  isAdmin: {
    type: Types.Boolean,
    default: false
  },
  addressLine1: Types.String,
  addressLine2: Types.String,
  city: Types.String,
  state: Types.String,
  zipCode: Types.Number,
  profilePic: {
    type: Types.String,
    default: ''
  },
  preferredPaymentMethod: {
    type: Types.String,
    enum: ['', 'paypal', 'check', 'deposit'],
    default: ''
  },
  paymentPreference: {
    type: paymentPreference
  },
  lastLoginDate: {
    type: Types.Date,
    default: Date.now
  },
  notes: {
    type: Types.String
  },
  gifts: [{
    type: Types.ObjectId,
    ref: 'Gift',
    required: true,
    index: true
  }]
});

UserSchema.plugin(passportLocalMongoose, {
  usernameLowerCase: true
});

module.exports = mongoose.model('User', UserSchema);
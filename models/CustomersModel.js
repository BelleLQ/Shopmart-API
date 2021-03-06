const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;
const {Schema} = mongoose;
const customerSchema = new Schema({
    firstName:{
        type : String,
        required : true
    },
    lastName:{
        type : String,
        required : true
    },
    email:{
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    phoneNumber:[{
        type : String
    }
    ]
})
customerSchema.pre('save', function(next) {
    const customer = this;
    // only hash the password if it has been modified (or is new)
    if (!customer.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(customer.password, salt, function(err, hash) {
            if (err) return next(err);
            // override the cleartext password with the hashed one
            customer.password = hash;
            next();
        });
    });
});
     
customerSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};
const customerModel = mongoose.model('Customer', customerSchema);
module.exports = customerModel;
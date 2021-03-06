const mongoose = require('mongoose'),
        Schema = mongoose.Schema
;
// Create Schema
const UserSchema = new Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default: Date.now
    }
});
mongoose.model('users',UserSchema);
import mongoose from '../app';
const { Schema } = mongoose;

const userSchema = new Schema({
    
        _id:{ type : mongoose.Schema.Type.ObjectId, required : true},
        email: {
            type : String, 
            required : true
            },
        password: {
            type : String, 
            required : true
            },
        name: { 
            type : String, 
            required : true
            },
        role: String,
    
        adress: {
            street: { 
                type : String, 
                required : true
            },
            zip: { 
                type : Number, 
                required : true
            },
            city: { 
                type : String, 
                required : true
            }
        },
        orderHistory: [...String ]
    })


modules.export = mongoose.model('User', userSchema)
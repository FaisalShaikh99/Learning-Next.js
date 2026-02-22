import mongoose, { Document, Schema} from 'mongoose';

// custome message schema
export interface Message extends Document{
    content : string;  // typescript
    createdAt : Date;
}

// Accessing custom schema of Message
const MessageSchema : Schema <Message> = new Schema({
  content : {
    type : String, 
    required : true
  },
  createdAt : {
    type : Date,
    required : true,
    default : Date.now
  }
})

// custome User schema
export interface User extends Document{
    username : string; 
    email :string;
    password : string;
    verifyCode : string,
    verifyCodeExpiry : Date,
    isVerified : boolean,
    isAcceptingMessages : boolean,
    messages : Message[]
}

// Accessing custom schema of User
const UserSchema : Schema <User> = new Schema({
  username : {
    type : String,
    required : [true, "Username is required"],
    unique : true
  },
  email : {
    type : String,
    required : [true, "Email is required"],
    unique : true,
    match : [/.+\@.+\..+/, 'please use valid email address']
  },
  password : {
    type : String,
    required : [true, "Password is required"],
  },
  verifyCode :{
    type : String,
    required : [true, "VerifyCode is required"],
  },
  verifyCodeExpiry :{
    type : Date,
    required : [true, "VerifyCodeExpiry is required"]
  },
  isVerified :  {
     type : Boolean,
     default : false,
  },
  isAcceptingMessages : {
    type : Boolean,
    default : true,
  },
  messages : [MessageSchema]
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel; 
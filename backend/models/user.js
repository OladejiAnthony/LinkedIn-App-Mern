// Import the mongoose module
const mongoose = require('mongoose');

// Define the schema for a User
const userSchema = new mongoose.Schema({
   // Define the 'name' field
   name: {
       type: String, // The type of data is a string
       required: true, // This field is required
   },
   // Define the 'email' field
   email: {
       type: String, // The type of data is a string
       required: true, // This field is required
       unique: true, // This field must be unique (no duplicate emails)
   },
   // Define the 'password' field
   password: {
       type: String, // The type of data is a string
       required: true, // This field is required
   },
   // Define the 'verified' field
   verified: {
       type: Boolean, // The type of data is a boolean (true or false)
       default: false // The default value is false
   },
   // Define the 'verificationToken' field
   verificationToken: String, // The type of data is a string
   // Define the 'profileImage' field
   profileImage: String, // The type of data is a string
   // Define the 'userDescription' field
   userDescription: {
       type: String, // The type of data is a string
       default: null // The default value is null
   },
   // Define the 'connections' field (an array of user IDs)
   connections: [
       {
           type: mongoose.Schema.Types.ObjectId, // The type of data is an ObjectId (references another document)
           ref: "User" // The referenced model is "User"
       }
   ],
   // Define the 'connectionRequests' field (an array of user IDs)
   connectionRequests: [
       {
           type: mongoose.Schema.Types.ObjectId, // The type of data is an ObjectId (references another document)
           ref: "User" // The referenced model is "User"
       }
   ],
   // Define the 'sentConnectionRequests' field (an array of user IDs)
   sentConnectionRequests: [
       {
           type: mongoose.Schema.Types.ObjectId, // The type of data is an ObjectId (references another document)
           ref: "User" // The referenced model is "User"
       }
   ],
   // Define the 'posts' field (an array of post IDs)
   posts: [
       {
           type: mongoose.Schema.Types.ObjectId, // The type of data is an ObjectId (references another document)
           ref: "Post" // The referenced model is "Post"
       }
   ],
   // Define the 'createdAt' field
   createdAt: {
       type: Date, // The type of data is a date
       default: Date.now // The default value is the current date and time
   }
});

// Create a model for User using the userSchema
const User = mongoose.model("User", userSchema);

// Export the User model so it can be used in other parts of the application
module.exports = User;


//EXLANATIONS:
/*
Defining Schema - 
`const userSchema = new mongoose.Schema({...});`: This line creates a new schema for the User model. A schema defines the structure of documents in the MongoDB collection, including fields and their types.

*/
/*
Schema Fields:
name: A required string field for the user's name.
email: A required and unique string field for the user's email.
password: A required string field for the user's password.
verified: A boolean field indicating whether the user is verified, with a default value of false.
verificationToken: A string field for storing a token used to verify the user.
profileImage: A string field for storing the URL of the user's profile image.
userDescription: A string field for a description of the user, with a default value of null.
connections: An array of ObjectIds referencing other User documents, representing the user's connections.
connectionRequests: An array of ObjectIds referencing other User documents, representing incoming connection requests.
sentConnectionRequests: An array of ObjectIds referencing other User documents, representing sent connection requests.
posts: An array of ObjectIds referencing Post documents, representing the user's posts.
createdAt: A date field indicating when the user was created, with a default value of the current date and time.
*/
/*
Creating A Model -
const User = mongoose.model("User", userSchema);: This line creates a model named User using the userSchema. A model is a constructor compiled from the schema and is used to create and read documents from the underlying MongoDB collection.

*/
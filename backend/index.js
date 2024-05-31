// Import the required modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");


//initialization 
const app = express(); // Creating an instance of an Express application
const port = 3000; // Defining the port number on which the server will listen for requests

//import cors
const cors = require("cors"); // Importing the cors module to enable Cross-Origin Resource Sharing


//Middleware Setup
app.use(cors()); // Using the cors middleware to allow requests from other origins
app.use(bodyParser.urlencoded({ extended: false })); // Using the body-parser middleware to parse URL-encoded bodies (form submissions)
app.use(bodyParser.json()); // Using the body-parser middleware to parse JSON bodies (API requests)
const jwt = require("jsonwebtoken"); // Importing the jsonwebtoken module to handle JSON Web Tokens (JWT) for authentication


//Connecting to MongoDB
mongoose
  .connect("mongodb+srv://oladejianthony4:Tdwonder1@linkedinapp.ruushsy.mongodb.net/", {
    useNewUrlParser: true, // Using the new URL parser (recommended)
    useUnifiedTopology: true, // Using the new Server Discover and Monitoring engine (recommended)
  })
  .then(() => {
    console.log("Connected to MongoDB"); // Logging a success message if the connection is successful
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err); // Logging an error message if the connection fails
  });


//Start the server
app.listen(port, () => {
  console.log("Server is running on port 8000"); // Logging a message when the server starts and listens on the specified port
});

/*Importing Models */
const User = require("./models/user"); 
const Post = require("./models/post"); 


/*Endpoints */

//test route
app.get("/", (req, res) => {
  res.send("Home Page")
})

//create first api
app.post("/api/first", async (req, res) => {
  console.log(req.body)
  res.send("First endpoint")
})

//endpoint to register a user in the backend
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, profileImage } = req.body;

    //check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("Email already registered");
      return res.status(400).json({ message: "Email already registered" });
    }

    //create a new User
    const newUser = new User({
      name,
      email,
      password,
      profileImage,
    });

    //generate the verification token
    //Check verificationToken field inside UserSchema
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the user to the database
    await newUser.save();

    //send the verification email to the registered user
    sendVerificationEmail(newUser.email, newUser.verificationToken);

    res.status(202).json({
      message:
        "Registration successful.Please check your mail for verification",
    });
  } catch (error) {
    console.log("Error registering user", error);
    res.status(500).json({ message: "Registration failed" });
  }
});

const sendVerificationEmail = async (email, verificationToken) => {
  //create transporter for sender email
  //create app passwords in myaccount.google.com using "Nodemailer" as the app name and copy the generated password
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "oladejianthony4@gmail.com",
      pass: "adttoascputmlwzz",
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  //compose the mail to send
  const mailOptions = {
    from: "linkedin@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `please click the following link to verify your email : http://192.168.0.5:3000/verify/${verificationToken}`,
  };

  //send the mail
  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent successfully");
  } catch (error) {
    console.log("Error sending the verification email: "+error);
    throw error
  }
};

//endpoint to verify email
app.get("/verify/:token", async (req, res) => {
  try {
    const token = req.params.token;
    //check if user has verificationToken
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(404).json({ message: "Invalid verification token" });
    }

    //mark the user as verified
    user.verified = true;
    //remove verificationToken from the backend
    user.verificationToken = undefined;
    //save user to backend 
    await user.save();

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Email verification failed" });
  }
});

const generateSecretKey = () => {
  const secretKey = crypto.randomBytes(32).toString("hex");

  return secretKey;
};

const secretKey = generateSecretKey();

//endpoint to login a user.
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    //check if user exists already
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    //check if password is correct
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    //generate token andcd send it in the result
    const token = jwt.sign({ userId: user._id }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

//other user's profile
app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user profile" });
  }
});

//get all other loggedIn users except the currently logged in userId
app.get("/users/:userId", async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;

    //fetch the logged-in user's connections
    const loggedInuser = await User.findById(loggedInUserId).populate(
      "connections",
      "_id"
    );
    if (!loggedInuser) {
      return res.status(400).json({ message: "User not found" });
    }

    //get the ID's of the connected users
    const connectedUserIds = loggedInuser.connections.map(
      (connection) => connection._id
    );

    //find the users who are not connected to the logged-in user Id
    const users = await User.find({
      _id: { $ne: loggedInUserId, $nin: connectedUserIds },
    });

    res.status(200).json(users);
  } catch (error) {
    console.log("Error retrieving users", error);
    res.status(500).json({ message: "Error retrieving users" });
  }
});

//send a connection request to other users
app.post("/connection-request", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;

    await User.findByIdAndUpdate(selectedUserId, {
      $push: { connectionRequests: currentUserId },
    });

    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentConnectionRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    res.status(500).json({ message: "Error creating connection request" });
  }
});

//endpoint to show all the connections requests from other users
app.get("/connection-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("connectionRequests", "name email profileImage")
      .lean();

    const connectionRequests = user.connectionRequests;

    res.json(connectionRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to accept a connection request
app.post("/connection-request/accept", async (req, res) => {
  try {
    const { senderId, recepientId } = req.body;

    const sender = await User.findById(senderId);
    const recepient = await User.findById(recepientId);

    sender.connections.push(recepientId);
    recepient.connections.push(senderId);

    recepient.connectionRequests = recepient.connectionRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentConnectionRequests = sender.sentConnectionRequests.filter(
      (request) => request.toString() !== recepientId.toString()
    );

    await sender.save();
    await recepient.save();

    res.status(200).json({ message: "Friend request acccepted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to fetch all the connections of a user
app.get("/connections/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .populate("connections", "name profileImage createdAt")
      .exec();

    if (!user) {
      return res.status(404).json({ message: "User is not found" });
    }
    res.status(200).json({ connections: user.connections });
  } catch (error) {
    console.log("error fetching the connections", error);
    res.status(500).json({ message: "Error fetching the connections" });
  }
});

//endpoint to create a post
app.post("/create", async (req, res) => {
  try {
    const { description, imageUrl, userId } = req.body;

    const newPost = new Post({
      description: description,
      imageUrl: imageUrl,
      user: userId,
    });

    await newPost.save();

    res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.log("error creating the post", error);
    res.status(500).json({ message: "Error creating the post" });
  }
});

//endpoint to fetch all the posts
app.get("/all", async (req, res) => {
  try {
    const posts = await Post.find().populate("user", "name profileImage");

    res.status(200).json({ posts });
  } catch (error) {
    console.log("error fetching all the posts", error);
    res.status(500).json({ message: "Error fetching all the posts" });
  }
});

//endpoints to like a post
app.post("/like/:postId/:userId", async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.params.userId;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    //check if the user has already liked the post
    const existingLike = post?.likes.find(
      (like) => like.user.toString() === userId
    );

    if (existingLike) {
      post.likes = post.likes.filter((like) => like.user.toString() !== userId);
    } else {
      post.likes.push({ user: userId });
    }

    await post.save();

    res.status(200).json({ message: "Post like/unlike successfull", post });
  } catch (error) {
    console.log("error likeing a post", error);
    res.status(500).json({ message: "Error liking the post" });
  }
});

//endpoint to update user description
app.put("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { userDescription } = req.body;

    await User.findByIdAndUpdate(userId, { userDescription });

    res.status(200).json({ message: "User profile updated successfully" });
  } catch (error) {
    console.log("Error updating user Profile", error);
    res.status(500).json({ message: "Error updating user profile" });
  }
});

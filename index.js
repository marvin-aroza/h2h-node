const express=require('express');
const app = express();

const port = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const mongoconnect = require('mongoose');
require('dotenv/config');
const cors = require('cors');

//Package middleware
app.use(cors());
app.use(bodyParser.json());
app.use(cors());
//Db connection
mongoconnect.connect(process.env.DB_CONNECT,{
    useNewUrlParser:true,useUnifiedTopology:true},()=>{
        console.log('Mongodb Connected');
})

//Routes imports
const registerRoute = require('./Routes/Auth/registration');
const loginRoute = require('./Routes/Auth/login');
const masterRoute = require('./Routes/Master/master');
const postRoute = require('./Routes/Post/Post');
const userRoute = require('./Routes/User/user');
const notificationRoute = require('./Routes/Notification/notification');
const contactRoute = require('./Routes/Contact/Contact');
const discussionRoute = require('./Routes/Discussion_Forum/discussion_forum');
const subDiscussionRoute = require('./Routes/Discussion_Forum/subdiscussion_forum');
const forumRoute = require('./Routes/Forum/forum');
const forumCommentRoute = require('./Routes/Forum_comment/forum_comment');

//Route middleware
app.use('/auth',registerRoute)
app.use('/login',loginRoute)
app.use('/master',masterRoute)
app.use('/post',postRoute)
app.use('/user',userRoute)
app.use('/notification',notificationRoute)
app.use('/contact',contactRoute)
app.use('/discussion',discussionRoute)
app.use('/subDiscussion',subDiscussionRoute)
app.use('/forum',forumRoute)
app.use('/forumComment',forumCommentRoute)

//These is used to allow access to the images folder
app.use('/public',express.static('public'));  
app.use('/images', express.static('images')); 

//Server poor
app.listen(port,()=>{
    console.log('Port running at 3000');
})
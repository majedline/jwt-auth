const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./routes/authRoutes');
const { response } = require('express');

const app = express();

// middleware
app.use(express.static('public'));
// takes any json data, and passes it to a javascript object and attached this object so we can use it in the request handler.
app.use(express.json());

// view engine
app.set('view engine', 'ejs');

// database connection
//const dbURI = 'mongodb://localhost/node-auth';
 const dbURI = 'mongodb://dbAuthUser:password1234@localhost/node-auth';


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRouter);

//cookies
app.get('/set-cookies', (req, res) => {
  res.setHeader('Set-Cookie', 'newUser=true');
  res.send('you got a cookie');
});

app.get('/read-cookies', (req, res) => {

});
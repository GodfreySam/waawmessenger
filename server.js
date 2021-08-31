const express = require('express');
const path = require('path');
const ejs = require('ejs');

const app = express();

// SETTING UP EXPRESS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get("/", (req, res, next) => {
   res.render('index');
});

app.get("/about", (req, res, next) => {
   res.render('');
});

const port = process.env.PORT || 9000;

app.listen(port, ()=> console.log(`server running on port:: ${port}`));
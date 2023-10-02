const express = require('express');
const session = require('express-session');
const passport = require('passport');
require('./auth')
const app = express();

const isLoggedIn = (req,res,next) => {
    req.user ? next() : res.sendStatus(401);
}

app.use(session({secret: 'cats', resave: false, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req,res)=>{
    res.send('<a href="/auth/google">Authenticate google</a>');
});

app.get('/auth/google',
    passport.authenticate('google',{scope: ['email','profile']})
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/protected',
        failureRedirect: '/auth/google/error'
    })
);

app.get('/logout', (req,res) => {
    req.logOut();
    req.session.destroy();
    res.send('GoodBye!')
})

app.get('/protected', isLoggedIn, (req,res) => {
    res.send(`Welcome, ${req.user.displayName}`);
})

app.get('/auth/google/error', (req,res) => {
    res.send('something went wrong');
})

app.listen(3000,() => {
    console.log('listen on 3000');
})
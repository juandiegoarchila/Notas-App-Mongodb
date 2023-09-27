const userCtrol = {};

const passpord = require('passport');

const User = require('../models/User')

userCtrol.rendersigUnForm = (req, res ) =>{
    res.render('users/signup');
};


userCtrol.signup = async (req, res) =>{
    const errors = [];
    const {name, email, password, confirm_password} = req.body;
    if(password != confirm_password) {
        errors.push({text: 'la contraseña no coincide'})
    }
    if(password.length < 4 ){
        errors.push({text: 'la contraseña debe tener al menos 4 caracteres'});
    }
    if(errors.length > 0) {
        res.render('users/signup', {
            errors,
            name,
            email,
            password,
            confirm_password
        })
    } else {
        const emailUser = await User.findOne({email: email})
        if(emailUser){
            req.flash('error_msg', 'el correo ya esta en uso');
             res.redirect('/users/signup');
        } else {
            const newUser = new User({name, email, password})
            newUser.password = await newUser.encryptPassword(password)
            await newUser.save();
            req.flash('success_msg', ' Ya estas registrado')
            res.redirect('/users/signin');
        }
    }
};


userCtrol.rendersigninForm = (req, res) => {
    res.render('users/signin');
}

userCtrol.signin = passpord.authenticate('local', {
    failureRedirect: '/users/signin',
    successRedirect: '/notes',
    failureFlash: true
});



userCtrol.logout = (req, res) =>{
    res.send('logout')
}


module.exports = userCtrol;
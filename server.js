const express=require('express');
const app=express();
const passport=require('passport');
const cookieParser=require('cookie-parser');
const session=require('express-session');
const PassportLocal=require('passport-local').Strategy

app.use(express.urlencoded({extended:true}))
app.use(cookieParser('mi frase secreta'));
app.use(session({
    secret:'mi frase secreta',
    resave:true,
    saveUninitialized:true
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(function(username,password,done){
    if (username==="jose" && password==="123456")
    return done(null,{id:1,name:"Jose"});
    done(null,false);
}));
passport.serializeUser(function(user,done){
    done(null,user.id)
});
passport.deserializeUser(function(id,done){
    done(null,{id:1, name:"Jose"})
    //en produccion este objeto lo buscariamos en la base de datos con el "id" de la function
})
app.set('view engine','ejs')
app.get('/',(req,res,next)=>{
    if(req.isAuthenticated())return next();
    res.redirect('/login');
}, (req,res,next)=>{
    // si la iniciamos mostrar bienvenica
// si no iniciamos redireccionar a login
    res.render("home")
})


app.get('/login',(req,res)=>{
// mostrar formulario de login
res.render("login")
})
app.post('/login',passport.authenticate('local',{
    successRedirect:"/",
    failureRedirect:"/login"
})
    
)

app.post('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

app.listen(3000,()=>{
    console.log('servidor iniciado')
})
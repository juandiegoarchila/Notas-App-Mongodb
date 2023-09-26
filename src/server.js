const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const morgan = require("morgan")
const methodOverride = require('method-override');
const  flash = require('connect-flash')
const session = require('express-session')
// Inicializaciones
const app = express();

module.exports = app;

// Configuraciones
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs.engine({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'secre',
  resave: true,
  saveUninitialized: true
}));

app.use(flash());


// Global variables
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg')
  next();
});

// Rutas
app.use(require("./routes/index.routes"));
app.use(require("./routes/notes.routes"));
app.use(require('./routes/users.routes'))



// Archivos estáticos
app.use(express.static(path.join(__dirname, "public")));

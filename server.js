/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const expressLayouts = require("express-ejs-layouts")
const express = require("express")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")

// week 3
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/index")


/* ***********************
 /* Set the View Engine and templates
 *************************/
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use(static);  // Use the static routes defined in static.js

// Altered Index route to use the baseController
//app.get("/", baseController.buildHome); // <-- Updated this line


// Index route
//app.get("/", function (req, res) {
 // res.render("index", { title: "Home" });
//});

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)

// ** New Route for Triggering Intentional Error **
app.get("/trigger-error", (req, res, next) => {
  // Trigger an intentional error
  throw new Error("This is an intentional error for testing purposes.");
});

// 404 Page
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 * *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  let message;
  if (err.status == 404) { 
      message = err.message; 
  } else { 
      message = 'Oh no! There was a crash. Maybe try a different route?'; 
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 3000; // 3000 como valor predeterminado
const host = process.env.HOST || 'localhost'; // Sin comillas
/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});
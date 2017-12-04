var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose'),
    cors = require('cors'),
    session = require('express-session'),
    MongoStore = require('connect-mongo')(session);

// Connection to DB
var options = { useMongoClient: true};
                
var mongodbUri = 'mongodb://fabian0007:fabian0007@ds157268.mlab.com:57268/bdbooks';
//var mongodbUri = 'mongodb://localhost/bdbooks';
mongoose.Promise = global.Promise;
mongoose.connect(mongodbUri, options);
var conn = mongoose.connection; 
conn.on('error', console.error.bind(console, 'connection error:'));  
 
conn.once('open', function() {
  console.log("Successful connection");                         
});

// Middlewares
app.use(session({secret: 'work hard', resave: true, saveUninitialized: false,store: new MongoStore({mongooseConnection: conn
  })}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(cors());

// Import Models and controllers
var models = require('./models/readbook');
var models2 = require('./models/author');
var models3 = require('./models/user');
var controller = require('./controllers/controller');


//Routes
var router = express.Router();
router.route('/profile')
  .get(controller.goProfile);

router.route('/')
  .post(controller.addUser);

app.use(router);

// API routes
var books = express.Router();

books.route('/books')
  .get(controller.findAllBooks)
  .post(controller.addBook);

books.route('/books/:id')
  .get(controller.findById)
  .put(controller.updateBook)
  .delete(controller.deleteBook);

app.use('', books);

var authors = express.Router();

authors.route('/authors')
  .get(controller.findAllAuthors)
  .post(controller.addAuthor);

authors.route('/authors/:id')
  .get(controller.findById)
  .put(controller.updateAuthor)
  .delete(controller.deleteAuthor);

app.use('', authors);

// Start server
app.listen(process.env.PORT, function() {
  console.log("Node server running on http://localhost:"+process.env.PORT);
});
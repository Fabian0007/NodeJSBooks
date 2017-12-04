//File: controllers/tvshows.js
var mongoose = require('mongoose');
var RBooks  = mongoose.model('Books');
var RAuthors  = mongoose.model('Authors');
var User  = mongoose.model('User');

exports.goProfile = function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        return res.json({ name: user.name, email: user.email });
      }
    });
};

exports.logout = function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
};

exports.addUser = function(req, res, next) {
	if (req.body.password !== req.body.passwordConf) {
		var err = new Error('Passwords do not match.');
	    err.status = 400;
	    res.send("passwords dont match");
	    return next(err);
	}
	if (req.body.email && req.body.username && req.body.password && req.body.passwordConf) {
		var userData = {
			email: req.body.email,
	    	username: req.body.username,
	    	password: req.body.password,
	    	passwordConf: req.body.passwordConf,
		}
		
		User.create(userData, function (error, user) {
			if (error) {
				return next(error);
			} 
			else {
				req.session.userId = user._id;
				return res.redirect('/profile')
			}
		});
		
	}
	else if (req.body.logemail && req.body.logpassword) {
		User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
			if (error || !user) {
				var err = new Error('Wrong email or password.');
				err.status = 401;
				return next(err);
			} 
			else {
				req.session.userId = user._id;
	        	return res.redirect('/profile');
			}
		});
	  } 
	  else {
	  	var err = new Error('All fields required.');
	    err.status = 400;
	    return next(err);
	  }};

//GET - Return all tvshows in the DB
exports.findAllBooks = function(req, res) {
	RBooks.find(function(err, books) {
    if(err) res.send(500, err.message);
    
     RAuthors.populate(books, {path: "authors"},function(err, libros){
     	 console.log('GET /books');
         res.status(200).send(libros);
        });
	});
};

//GET - Return a TVShow with specified ID
exports.findById = function(req, res) {
	RBooks.findById(req.params.id, function(err, book) {
    	if(err) return res.send(500, err.message);

    	console.log('GET /books/' + req.params.id);
		res.status(200).jsonp(book);
	});
};

//POST - Insert a new TVShow in the DB
exports.addBook = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var book = new RBooks({
		title:    req.body.title,
		year: 	  req.body.year,
		authors:  req.body.authors,
		description:  req.body.description,
		review:  req.body.review,
		poster:   req.body.poster,
		stars:  req.body.stars,
	});

	book.save(function(err, book) {
		if(err) return res.send(500, err.message);
    res.status(200).jsonp(book);
	});
};

//PUT - Update a register already exists
exports.updateBook = function(req, res) {
	RBooks.findById(req.params.id, function(err, book) {
		book.title   = req.body.petId;
		book.year    = req.body.year;
		book.country = req.body.country;
		book.poster  = req.body.poster;
		book.seasons = req.body.seasons;
		book.genre   = req.body.genre;
		book.summary = req.body.summary;

		book.save(function(err) {
			if(err) return res.send(500, err.message);
    	res.status(200).jsonp(book);
		});
	});
};

//DELETE - Delete a TVShow with specified ID
exports.deleteBook = function(req, res) {
	console.log('DELETE');
	RBooks.findById(req.params.id, function(err, book) {
    	book.remove(function(err) {
			if(err) return res.send(500, err.message);
			console.log('delete /book')
    		res.status(200);
		});
	});
};


//GET - Return all tvshows in the DB
exports.findAllAuthors = function(req, res) {
	RAuthors.find(function(err, authors) {
    if(err) res.send(500, err.message);

    console.log('GET /Authors')
		res.status(200).jsonp(authors);
	});
};

//GET - Return a TVShow with specified ID
exports.findById = function(req, res) {
	RAuthors.findById(req.params.id, function(err, author) {
    	if(err) return res.send(500, err.message);

    	console.log('GET /authors/' + req.params.id);
		res.status(200).jsonp(author);
	});
};

//POST - Insert a new TVShow in the DB
exports.addAuthor = function(req, res) {
	console.log('POST');
	console.log(req.body);

	var author = new RAuthors({
		name:    req.body.name,
		biography: 	  req.body.biography,
		birthdate:  req.body.birthdate,
		nationality:  req.body.nationality,
	});
	console.log(author);

	author.save(function(err, author) {
		if(err) return res.sendStatus(500, err.message);
    res.sendStatus(200);
	});
};

//PUT - Update a register already exists
exports.updateAuthor = function(req, res) {
	RAuthors.findById(req.params.id, function(err, author) {
		author.name=  req.body.name;
		author.biography= req.body.biography;
		author.birthdate= req.body.birthdate;
		author.nationality= req.body.nationality;
		author.save(function(err) {
			if(err) return res.send(500, err.message);
    	res.status(200).jsonp(author);
		});
	});
};

//DELETE - Delete a TVShow with specified ID
exports.deleteAuthor = function(req, res) {
	console.log('DELETE');
	RAuthors.findById(req.params.id, function(err, author) {
    	author.remove(function(err) {
			if(err) return res.send(500, err.message);
			console.log('delete /author')
    		res.status(200);
		});
	});
};

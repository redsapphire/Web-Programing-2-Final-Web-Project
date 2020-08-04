const mongo = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017/test';
const cors = require('cors');
var bodyParser = require('body-parser');
const { books } = require('./models/books');
var exphbs = require('express-handlebars');
var express = require('express')
 , app = express()
 , http = require('http')
 , server = http.createServer(app)
 , io = require('socket.io').listen(server);
 
//handler settings
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials/',
    extname: 'hbs',
    defaultLayout: 'index',
}));
app.use(express.static(__dirname + '/public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = 8900;
server.listen(port);
console.log(`Listening to server: http://localhost:${port}`)

// Landing page
app.get('/', (req, res) => {
    let message = "This is a pretty cool page!";
    let colors = ["Olympic Purple Surf C44-4", "Red", "blue"];
    let pets = [{ name: "Snoozer", type: "Dog", age: 11 }, { name: "Grace", type: "Aplaca" }]
    res.render('home', { message: message, colors: colors, pets: pets });
});
//CORS - cross-origin resource sharing
app.use(cors())

//encode document
app.use(bodyParser.urlencoded({ extended: false }));

//parsing JSON
app.use(bodyParser.json());


// APIs and rest code


//GET ALL records:  /api/
app.get('/api/', (req, res) => {
    res.json(books);
})

//GET ONE records:  /api/:id
app.get('/api/:id', (req, res) => {
    let id = req.params.id;
    let record = "No Record Found.";
    //if found record, return index position
    //else return -1
    let index = books.findIndex((book) => book.id == id)

    if (index != -1) {
        record = books[index];
    }
    res.json([record]);
})

//DELETE ONE Record:  /api/:id
app.delete('/api/:id', (req, res) => {
    let id = req.params.id;
    let message = "No Record Found.";
    //if found record, return index position
    //else return -1
    let index = books.findIndex((book) => book.id == id)

    if (index != -1) {
        books.splice(index, 1);
        message = "Record Deleted."
    }
    res.json(message);
})

//DELETE ALL Records:  /api/
app.delete('/api/', (req, res) => {
    books.splice(0);
    res.json('All Records Deleted.');
});

//POST - Inserting a new record:  /api/
app.post('/api/', (req, res) => {
    let newBook = req.body;
    books.push(newBook);

    //Should check for duplicates
    res.json("New Book Added.");
})

//PUT - Updating an existing record:  /api/:id
app.put('/api/:id', (req, res) => {
    let message = "No Record Found.";
    let newBook = req.body;
    let id = req.params.id;
    let index = books.findIndex((book) => book.id == id)

    if (index != -1) {
        books[index] = newBook;
        message = "Record Updated."
    }
    res.json(message);
})
// Catch all - must be at bottom of all GET methods
app.get('/', (req, res) => {
    res.render("main");
});
app.get('/about', (req, res) => {
    res.render("about");
});
app.get('/contact', (req, res) => {
    res.render("contact");
});
app.get('/portfolio', (req, res) => {
    res.render("portfolio");
});
app.get('/dragndrop', (req, res) => {
    res.render("dragndrop");
});
app.get('/ajak', (req, res) => {
    res.render("ajak");
});
app.get('/chat', (req, res) => {
    res.render("chat");
});



/* Chat Progran */
var usernames = {};
io.sockets.on('connection', function (socket) {
    socket.on('sendchat', function (data) {
        io.sockets.emit('updatechat', socket.username, data);
    });
    socket.on('adduser', function (username) {
        socket.username = username;
        usernames[username] = username;
        socket.emit('updatechat', 'SERVER', 'you have connected');
        socket.broadcast.emit('updatechat', 'SERVER'
            , username + ' has connected');
        io.sockets.emit('updateusers', usernames);
    });
    socket.on('disconnect', function () {
        delete usernames[socket.username];
        io.sockets.emit('updateusers', usernames);
        socket.broadcast.emit('updatechat', 'SERVER'
            , socket.username + ' has disconnected');
    });
});

app.get('/api/users', function (req, res) {
    mongo.connect(url, { useNewUrlParser: true }, function (err, database) {
        const db = database.db('test');
        db.collection('users').find()
            .toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                console.log(result.length + ' documents retrieved.');
                //res.json(result);
                res.render('users', { data: result, layout: false })
                database.close();
            });
    });
});
app.get('/api/users', function (req, res) {
    mongo.connect(url, { useNewUrlParser: true }, function (err, database) {
        const db = database.db('unit7_db');
        db.collection('users').find()
            .toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                console.log(result.length + ' documents retrieved.');
                //res.json(result);
                res.render('users', { data: result, layout: false })
                database.close();
            });
    });
});
app.delete('/api/users', function (req, res) {
    mongo.connect(url, { useNewUrlParser: true }, function (err, database) {
        const db = database.db('test');
        db.collection('users').find()
            .toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                console.log(result.length + ' documents retrieved.');
                //res.json(result);
                res.render('users', { data: result, layout: false })
                database.close();
            });
    });
});
app.put('/api/users', function (req, res) {
    mongo.connect(url, { useNewUrlParser: true }, function (err, database) {
        const db = database.db('test');
        db.collection('users').find()
            .toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                console.log(result.length + ' documents retrieved.');
                //res.json(result);
                res.render('users', { data: result, layout: false })
                database.close();
            });
    });
});
app.post('/api/users', function (req, res) {
    mongo.connect(url, { useNewUrlParser: true }, function (err, database) {
        const db = database.db('test');
        db.collection('users').find()
            .toArray(function (err, result) {
                if (err) {
                    throw err;
                }
                console.log(result.length + ' documents retrieved.');
                //res.json(result);
                res.render('users', { data: result, layout: false })
                database.close();
            });
    });
});

app.get('CRUD', function (request, response) {
    res.render('CRUD', { root: __dirname });
});
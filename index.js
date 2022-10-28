require('dotenv').config();
const express = require("express");
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');
const socketSrevice = require('./services/socketService')

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const corsOptions = {
    credentials: true, // This is important.
    origin: (origin, callback) => {
        return callback(null, true)
    }
}

const app = express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cors(corsOptions));
app.use((req, res) => {
    res.header('Access-Control-Allow-Credentials', true);
    req.next();
});

app.use('/', require('./routes/index'));

app.use('/api/user', require('./routes/userRoute'));
app.use('/api/public', require('./routes/publicRoute'));
app.use('/party', require('./routes/partyRoute'));

const nocache = (_, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
}

// error handler
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    return res.json({
        code: "NOT_FOUNT_ROUTE",
    });
});
const server = app.listen(PORT, () => console.log("Listening on localhost:" + PORT));

socketSrevice.createSocket(server);

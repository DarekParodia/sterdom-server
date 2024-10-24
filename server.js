const config = require('./config.json');
const fs = require('fs');

var path = require('path');
var express = require('express');
var app = express();
var phpExpress = require('php-express')({
    binPath: 'php'
});

// set view engine to php-express
app.set('views', path.join(__dirname, config.php_folder));
app.engine('php', phpExpress.engine);
app.set('view engine', 'php');

app.all(/.+\.php$/, phpExpress.router);

app.use('/@popperjs/core/dist', express.static(path.join(__dirname, '/node_modules/@popperjs/core/dist')))
app.use('/jquery/dist', express.static(path.join(__dirname, '/node_modules/jquery/dist')))
app.use('/bootstrap/dist', express.static(path.join(__dirname, '/node_modules/bootstrap/dist')));
app.use('/bootstrap-icons/icons', express.static(path.join(__dirname, '/node_modules/bootstrap-icons/icons')));
app.use('/bootstrap-icons/font', express.static(path.join(__dirname, '/node_modules/bootstrap-icons/font')));
app.use('/', express.static(path.join(__dirname, config.public_folder)))

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

app.get('/', (req, res) => {
    res.render('index.php');
})

app.all('*', (req, res) => {
    // get php file based on requested path
    let phpFile = req.path.replace(/^\//, '');

    console.log(phpFile);


    // // if requested path doesn't end with file extension add ".php"
    phpFile += ".php";

    // Check if the PHP file exists
    let filePath = path.join(app.get('views'), phpFile);

    if (!fs.existsSync(filePath)) {
        console.log(`Client ${req.ip} request not existing route: ${req.path}`);

        res.status(404).send('Page not found');
        return;
    }

    try {
        res.render(phpFile);
    } catch (error) {
        next(error);
    }
});

var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('PHPExpress app listening at http://%s:%s', host, port);
});
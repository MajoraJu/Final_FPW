const express = require('express');
const app = express();
app.use(express.json());

// Settings
app.set('port', 3000);

// Control CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// Routes
app.use(require('./routes/obstacles'));

// Starting the server
app.listen(app.get('port'), () => {
    console.log(`Server on port 3000`);
});

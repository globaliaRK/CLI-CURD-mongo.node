const { connect } = require('mongoose');

connect('mongodb://localhost:27017/webScraping', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const mongoose = require('mongoose')

const photoSchema = new mongoose.Schema({
    id : String,
    taken : String,
    posted : String,
    lastupdate : String,
    url : String,
})

module.exports = mongoose.model('Photo', photoSchema)

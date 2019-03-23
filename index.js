// External Dependancies
const boom = require('boom')

// Require external modules
const mongoose = require('mongoose')
const Photo = require('./model/Photo')

// Connect to DB
mongoose.connect('mongodb+srv://cloud1:cloud1@cluster0-nzggw.mongodb.net/redsteed1?retryWrites=true',
  { useNewUrlParser: true }
  ).then(() => console.log('MongoDB connected…'))
  .catch(err => console.log(err))


const Flickr = require("flickrapi"),
    flickrOptions = {
      api_key: "36c1ab46cca75640d3c6935f12e75d19",
      secret: "dc0e0da4045b69cc"
};

Flickr.tokenOnly(flickrOptions, function(error, flickr) {
  // we can now use "flickr" as our API object,
  // but we can only call public methods and access public data
  flickr.photos.search({
    user_id: flickr.options.user_id,
    text: "food",
    page: 1,
    per_page: 100
  }, function(err, result) {
    // result is Flickr's response
    //console.log(result);
    if( result && result.photos && result.photos.photo) {
        result.photos.photo.forEach((photo, index) => {
            //console.log(photo.id)
            flickr.photos.getInfo({
                user_id: flickr.options.user_id,
                photo_id: photo.id
               
              }, function(err, result) {
                //console.log(result.photo.urls.url);
                try {
                    let photo = new Photo({    id : result.photo.id,
                        taken : result.photo.dates.taken,
                        posted : result.photo.dates.posted,
                        lastupdate : result.photo.dates.lastupdate,
                        url : result.photo.urls.url[0]._content
                   });
                   photo.save()
                  } catch (err) {
                    throw boom.boomify(err)
                  }
              });

         })    
    }
    
  });

});
console.log("App started");

const PORT = process.env.PORT || 3000;


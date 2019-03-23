const PORT = process.env.PORT || 3000;

// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
  })

  
// Import Routes
const routes = require('./routes')


// External Dependancies
const boom = require('boom')

// Loop over each route
routes.forEach((route, index) => {
    fastify.route(route)
  })


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


fastify.get('/', async (request, reply) => {
    reply.header('Content-Type', 'text/html')
    reply.type('text/html')
    return `<H1>Please use the api at <a href="/api/photos">/api/photos</a> </H1>
            <p>Or calling photo list at <a href="/photos/food">/photos/food</a></p>
            <HR/>`;
 })

 fastify.get('/delay', async (request, reply) => {
    reply.header('Content-Type', 'text/html')
    reply.type('text/html')
    return `Hello World`;
 })

 fastify.get('/photos/food', async (request, reply) => {
    reply.header('Content-Type', 'text/html')
    reply.type('text/html')
    const photos = await Photo.find();
    let payload = `<ul>`;
    photos.forEach((photo, index) => {
        payload+=`<li><a href="${photo.url}"> ID: ${photo.id} </a> &nbsp; Taken:${photo.taken} `;
    })
    payload +=`</ul>`;
    return payload;
 })
  
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
                   //console.log('X');
                   // photo.save() // commented out as no delete at the moment and scheduler..... run it once to populate DB!
                  } catch (err) {
                    throw boom.boomify(err)
                  }
              });

         })    
    }
    
  });

});
console.log("App started");

// Run the server!
const start = async () => {
    try {
      await fastify.listen(PORT, '0.0.0.0')
      fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  }
  start()
  



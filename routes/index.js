
// Import our Controllers
const photoController = require('../controller/photoController')


const routes = [
  {
    method: 'GET',
    url: '/api/photos',
    handler: photoController.getPhotos
  },
  {
    method: 'DELETE',
    url: '/api/photos',
    handler: photoController.deletePhotos
  }
]

module.exports = routes

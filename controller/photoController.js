// External Dependancies
const boom = require('boom')

// Get Data Models
const Photo = require('../model/Photo')

exports.getPhotos = async (req, reply) => {
  try {
    const photos = await Photo.find()
    return photos
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.getSinglePhoto = async (req, reply) => {
  try {
    const id = req.params.id
    const photo = await Photo.findById(id)
    return photo
  } catch (err) {
    throw boom.boomify(err)
  }
}

exports.addPhoto = async (req, reply) => {
  try {
    const photo = new Photo({...(req.body)})
    return photo.save()
  } catch (err) {
    throw boom.boomify(err)
  }
}
  
exports.deletePhotos = async (req, reply) => {
    try {
      console.log('DELETE all photos');
      return;
    } catch (err) {
      throw boom.boomify(err)
    }
}
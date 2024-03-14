require('dotenv').config()
const path = require('path')
const {
  rekognition,
  s3
} = require('./utility')

// The current code is quite ugly😅
const buildUpMyDatabase = async (collectionId) => {
  let userId, faceIds

  userId = process.env.PERSON_A_NAME.replace(/\s/g, '')
  faceIds = []
  await rekognition.createUser(collectionId, userId)
  faceIds.push(...await rekognition.indexFaces(collectionId, process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_A_NAME}/1.jpg`, userId, 1))
  faceIds.push(...await rekognition.indexFaces(collectionId, process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_A_NAME}/2.jpeg`, userId, 1))
  faceIds.push(...await rekognition.indexFaces(collectionId, process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_A_NAME}/3.jpg`, userId, 1))
  await rekognition.associateFaces(collectionId, userId, faceIds)

  userId = process.env.PERSON_B_NAME.replace(/\s/g, '')
  faceIds = []
  await rekognition.createUser(collectionId, userId)
  faceIds.push(...await rekognition.indexFaces(collectionId, process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_B_NAME}/1.jpg`, userId, 1))
  faceIds.push(...await rekognition.indexFaces(collectionId, process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_B_NAME}/2.jpg`, userId, 1))
  faceIds.push(...await rekognition.indexFaces(collectionId, process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_B_NAME}/3.jpg`, userId, 1))
  await rekognition.associateFaces(collectionId, userId, faceIds)

  userId = process.env.PERSON_C_NAME.replace(/\s/g, '')
  faceIds = []
  await rekognition.createUser(collectionId, userId)
  faceIds.push(...await rekognition.indexFaces(collectionId, process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_C_NAME}/1.jpeg`, userId, 1))
  faceIds.push(...await rekognition.indexFaces(collectionId, process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_C_NAME}/2.jpg`, userId, 1))
  faceIds.push(...await rekognition.indexFaces(collectionId, process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_C_NAME}/3.jpeg`, userId, 1))
  await rekognition.associateFaces(collectionId, userId, faceIds)
}

async function main() {
  const collectionId = 'my-first-collection'
  // await rekognition.createCollection(collectionId)
  // await buildUpMyDatabase(collectionId)
  // await rekognition.describeCollection(collectionId)
  // await rekognition.searchUsersByImage(collectionId, process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/1.jpeg`)

  // const filename = `${process.env.FOLDER_NAME}/1.jpeg`
  // const filename = `${process.env.FOLDER_NAME}/2.jpeg`
  // const filename = `${process.env.FOLDER_NAME}/2.webp` // InvalidImageFormatException
  // const filename = `${process.env.FOLDER_NAME}/3.jpeg`
  // const faceIds = await rekognition.indexFaces(collectionId, process.env.BUCKET_NAME, filename, undefined, 100)
  const filename = path.join(__dirname, './images/local.jpeg')
  const faceIds = await rekognition.indexFacesLocal(collectionId, filename, undefined, 100)
  for (const faceId of faceIds) {
    await rekognition.searchUsers(collectionId, faceId)
  }
  await rekognition.deleteFaces(collectionId, faceIds)
}

main().catch(err => console.log(err))

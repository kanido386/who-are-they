require('dotenv').config()
const {
  rekognition,
  s3
} = require('./utility')

async function main() {
  // await rekognition.createCollection('my-first-collection')
  // await rekognition.describeCollection('my-first-collection')
  await rekognition.detectFaces(process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_A_NAME}/1.jpg`)
  // await rekognition.detectFaces(process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_A_NAME}/2.jpeg`)
  // await rekognition.detectFaces(process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/${process.env.PERSON_A_NAME}/3.jpg`)
  // await s3.listObjects(process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/`)
}

main().catch(err => console.log(err))

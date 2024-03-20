require('dotenv').config()
const fs = require('fs').promises
const fs2 = require('fs') // FIXME:
const _ = require('lodash')
const path = require('path')
const {
  rekognition,
  s3
} = require('./utility')

const delay = ms => new Promise(res => setTimeout(res, ms))

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

const buildUpMyDatabaseLocal = async (collectionId) => {
  try {
    const collectionPath = `./collections/${collectionId}`
    // TODO: make it a function
    const stats = await fs.stat(collectionPath)
    if (!stats.isDirectory()) {
      throw new Error(`${collectionPath} is not a directory!`)
    }

    await rekognition.createCollection(collectionId)
    await delay(5000) // Might get ResourceNotFoundException if no delay right after the creation of the collection

    const userIds = await fs.readdir(collectionPath)
    for (const userId of userIds) {
      const userFolderPath = path.join(collectionPath, userId)
      // console.log(userFolderPath)
      // TODO: make it a function
      const stats = await fs.stat(userFolderPath)
      if (!stats.isDirectory()) {
        throw new Error(`${userFolderPath} is not a directory!`)
      }
      console.log('===== Processing user:', userId)
      await rekognition.createUser(collectionId, userId)
      const faceIds = []
      const files = await fs.readdir(userFolderPath)
      for (const file of files) {
        // TODO: maybe need additional check
        console.log('Processing file:', file)
        const filename = path.join(__dirname, `./${userFolderPath}/${file}`)
        faceIds.push(...await rekognition.indexFacesLocal(collectionId, filename, userId, 1))
      }
      await rekognition.associateFaces(collectionId, userId, faceIds)
    }
    // console.log('==============================')
    // console.dir(stats, { depth: null })
    // console.log('==============================')
  } catch (err) {
    console.error('Error processing collection:', err)
  }
}

async function main() {
  const collectionId = 'test'
  // await rekognition.createCollection(collectionId)
  // await buildUpMyDatabase(collectionId)
  // await rekognition.describeCollection(collectionId)
  // await rekognition.searchUsersByImage(collectionId, process.env.BUCKET_NAME, `${process.env.FOLDER_NAME}/1.jpeg`)

  // // const filename = `${process.env.FOLDER_NAME}/1.jpeg`
  // // const filename = `${process.env.FOLDER_NAME}/2.jpeg`
  // // const filename = `${process.env.FOLDER_NAME}/2.webp` // InvalidImageFormatException
  // // const filename = `${process.env.FOLDER_NAME}/3.jpeg`
  // // const faceIds = await rekognition.indexFaces(collectionId, process.env.BUCKET_NAME, filename, undefined, 100)
  // const filename = path.join(__dirname, './images/local.jpeg')
  // const faceIds = await rekognition.indexFacesLocal(collectionId, filename, undefined, 100)
  // for (const faceId of faceIds) {
  //   await rekognition.searchUsers(collectionId, faceId)
  // }
  // await rekognition.deleteFaces(collectionId, faceIds)

  // await buildUpMyDatabaseLocal('test')

  // await rekognition.listCollections()
  // await rekognition.describeCollection('test')
  // await rekognition.deleteCollection('test')

  const todoFolder = path.join(__dirname, 'todo')
  // const aFolder = path.join(__dirname, 'todo', 'A')
  // const bFolder = path.join(__dirname, 'todo', 'B')
  // const cFolder = path.join(__dirname, 'todo', 'C')
  const doneFolder = path.join(__dirname, 'todo', 'done')
  // await fs.mkdir(aFolder, { recursive: true })
  // await fs.mkdir(bFolder, { recursive: true })
  // await fs.mkdir(cFolder, { recursive: true })
  await fs.mkdir(doneFolder, { recursive: true })
  const files = await fs.readdir(todoFolder, { withFileTypes: true })
  for (const file of files) {
    // console.log(file)
    // console.log('file.isFile(): ', file.isFile())
    // console.log('file.isDirectory(): ', file.isDirectory())
    if (!file.isFile()) continue
    const filename = file.name

    const faceIds = await rekognition.indexFacesLocal(collectionId, `${todoFolder}/${filename}`, undefined, 100)
    for (const faceId of faceIds) {
      const response = await rekognition.searchUsers(collectionId, faceId)
      const userId = _.get(response, 'UserMatches[0].User.UserId')
      // console.dir({ response, userId }, { depth: null })
      if (!userId) {
        continue
      }
      const folder = path.join(__dirname, 'todo', userId)
      console.log('fs2.existsSync(folder): ', fs2.existsSync(folder))
      if (!fs2.existsSync(folder)) {
        await fs.mkdir(folder)
      }
      await fs.copyFile(`${todoFolder}/${filename}`, `${folder}/${filename}`)
    }
    await rekognition.deleteFaces(collectionId, faceIds)

    // if (filename !== '1.jpeg') await fs.copyFile(`${todoFolder}/${filename}`, `${aFolder}/${filename}`)
    // if (filename !== '2.jpeg') await fs.copyFile(`${todoFolder}/${filename}`, `${bFolder}/${filename}`)
    // if (filename === '3.jpeg') await fs.copyFile(`${todoFolder}/${filename}`, `${cFolder}/${filename}`)
    await fs.rename(`${todoFolder}/${filename}`, `${doneFolder}/${filename}`)
  }
}

main().catch(err => console.log(err))

const _ = require('lodash')
const {
  RekognitionClient,
  CreateCollectionCommand,
  ListCollectionsCommand,
  DeleteCollectionCommand,
  DescribeCollectionCommand,
  DetectFacesCommand,
  IndexFacesCommand,
  CreateUserCommand,
  AssociateFacesCommand,
  SearchUsersByImageCommand
} = require('@aws-sdk/client-rekognition')
const client = new RekognitionClient()

const createCollection = async (name) => {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/CreateCollectionCommand/
  const input = {
    CollectionId: name
  }
  const command = new CreateCollectionCommand(input)
  const response = await client.send(command)
  // console.log('createCollection response: %j', response)
  console.log('createCollection response:')
  console.dir(response, { depth: null })
}

const listCollections = async () => {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/ListCollectionsCommand/
  const input = {}
  const command = new ListCollectionsCommand(input)
  const response = await client.send(command)
  console.log('listCollections response:')
  console.dir(response, { depth: null })
}

const deleteCollection = async (name) => {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/DeleteCollectionCommand/
  const input = {
    CollectionId: name
  }
  const command = new DeleteCollectionCommand(input)
  const response = await client.send(command)
  console.log('deleteCollection response:')
  console.dir(response, { depth: null })
}

const describeCollection = async (name) => {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/DescribeCollectionCommand/
  const input = {
    CollectionId: name
  }
  const command = new DescribeCollectionCommand(input)
  const response = await client.send(command)
  console.log('describeCollection response:')
  console.dir(response, { depth: null })
}

/**
 * Detects faces within an image that is provided as input.
 * @param {string} bucket Name of the S3 bucket.
 * @param {string} name   S3 object key name.
 * @returns {import('@aws-sdk/client-rekognition').FaceDetail[]} Details of each face found in the image.
 */
const detectFaces = async (bucket, name) => {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/DetectFacesCommand/
  const input = {
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: name
      }
    }
  }
  const command = new DetectFacesCommand(input)
  const response = await client.send(command)
  const faceDetails = _.get(response, 'FaceDetails')
  console.dir(faceDetails, { depth: null })
  console.log(faceDetails.length)
  return faceDetails
}

const indexFaces = async (collectionId, bucket, name, externalImageId) => {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/IndexFacesCommand/
  const input = {
    CollectionId: collectionId,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: name
      }
    },
    ExternalImageId: externalImageId,
    MaxFaces: 1
  }
  const command = new IndexFacesCommand(input)
  const response = await client.send(command);
  console.log('indexFaces response:')
  console.dir(response, { depth: null })
  return _.get(response, 'FaceRecords[0].Face.FaceId')
}

const createUser = async (collectionId, userId) => {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/CreateUserCommand/
  const input = {
    CollectionId: collectionId,
    UserId: userId
  }
  const command = new CreateUserCommand(input)
  const response = await client.send(command);
  console.log('createUser response:')
  console.dir(response, { depth: null })
}

const associateFaces = async (collectionId, userId, faceIds) => {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/AssociateFacesCommand/
  const input = {
    CollectionId: collectionId,
    UserId: userId,
    FaceIds: faceIds
  }
  const command = new AssociateFacesCommand(input)
  const response = await client.send(command);
  console.log('associateFaces response:')
  console.dir(response, { depth: null })
}

const searchUsersByImage = async (collectionId, bucket, name) => {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/SearchUsersByImageCommand/
  const input = {
    CollectionId: collectionId,
    Image: {
      S3Object: {
        Bucket: bucket,
        Name: name
      }
    }
  }
  const command = new SearchUsersByImageCommand(input)
  const response = await client.send(command);
  console.log('searchUsersByImage response:')
  console.dir(response, { depth: null })
}

module.exports = {
  createCollection,
  listCollections,
  deleteCollection,
  describeCollection,
  detectFaces,
  indexFaces,
  createUser,
  associateFaces,
  searchUsersByImage
}

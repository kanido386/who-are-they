const {
  RekognitionClient,
  CreateCollectionCommand,
  ListCollectionsCommand,
  DeleteCollectionCommand,
  DescribeCollectionCommand
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

async function main() {
  await createCollection('my-first-collection')
  // await listCollections()
  // await deleteCollection('my-second-collection')
  await describeCollection('my-first-collection')
}

main().catch(err => console.log(err))

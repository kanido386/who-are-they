const _ = require('lodash')
const {
  S3Client,
  ListObjectsV2Command
} = require('@aws-sdk/client-s3')
const client = new S3Client()

const listObjects = async (bucket, prefix) => {
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/ListObjectsV2Command/
  const input = {
    Bucket: bucket,
    Prefix: prefix
  }
  const command = new ListObjectsV2Command(input)
  const response = await client.send(command)
  const contents = _.get(response, 'Contents')
  console.dir(contents, { depth: null })
}

module.exports = {
  listObjects
}

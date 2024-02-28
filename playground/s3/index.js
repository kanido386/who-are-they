require('dotenv').config({ path: '../.env' })
const { S3Client, ListObjectsCommand } = require('@aws-sdk/client-s3')
const client = new S3Client()

async function main() {
  const input = {
    Bucket: process.env.BUCKET_NAME,
    Prefix: process.env.FOLDER_NAME
  }
  const command = new ListObjectsCommand(input)
  const response = await client.send(command)
  console.dir(response, { depth: null })
}

main().catch(err => console.log(err))

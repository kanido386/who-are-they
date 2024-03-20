# who-are-they

### To Do
- Tidy up the code

### In Progress


### ✅ Done
- Can copy and move image to user folders according to the detected faces
- Can buildUpMyDatabase with local images
- Can detect the faces of local images (don't need to upload them to S3 beforehand)
- Try [SearchUsersCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/SearchUsersCommand/) to search mutiple users in an image
- Make them functions and call them one by one as POC, don't need to be end-to-end
  - [CreateCollectionCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/CreateCollectionCommand/) → [CreateUserCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/CreateUserCommand/) → You can use [DetectFacesCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/DetectFacesCommand/) ahead of indexing to verify there is only one face in the image. → [IndexFacesCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/IndexFacesCommand/) → [AssociateFacesCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/AssociateFacesCommand/) → [SearchUsersByImageCommand](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/rekognition/command/SearchUsersByImageCommand/)
- Attached `AmazonRekognitionFullAccess` policy directly to my IAM user
- Read related AWS doc to get familiar with the topic
  - [Amazon Rekognition Developer Guide: Searching faces in a collection](https://docs.aws.amazon.com/rekognition/latest/dg/collections.html)
  - [Amazon Rekognition Developer Guide: Detecting and analyzing faces](https://docs.aws.amazon.com/rekognition/latest/dg/faces.html)
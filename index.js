console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });


exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const fileName = decodeURIComponent(event.Records[0].s3.object.fileName.replace(/\+/g, ' '));
    const fileSize = event.Records[0].s3.object.size;

    console.log(bucket, fileName, fileSize);

    const params = {
        Bucket: bucket,
        Key: 'images.json', // prev -> fileName
    };

    try {
        const manifest = await s3.getObject(params).promise();

        let manifestData = JSON.parse(manifest.Body.toString());

        manifestData.push({
            name: fileName,
            size: fileSize,
            type: 'image',
        });
        let manifestBody = JSON.stringify(manifestData);

        const newManifest = await s3.putObject({...params, Body: manifestBody, ContentType: 'application/json'}).promise();
    } catch(e) {
        console.log(e);
        const newManifest = {
            Bucket: bucket,
            Key: 'images.json',
            Body: JSON.stringify([{ name: fileName, size: fileSize, type: 'image'}]),
            ContentType: 'application/json',
        }

        const manifest = await s3.putObject(newManifest).promise();
        console.log('JSON file created for bucket:', manifest);
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify('lambda triggered'),
    };

    return response;
};

/* 

AWS generated lambda function

console.log('Loading function');

const aws = require('aws-sdk');

const s3 = new aws.S3({ apiVersion: '2006-03-01' });


exports.handler = async (event, context) => {
    //console.log('Received event:', JSON.stringify(event, null, 2));

    // Get the object from the event and show its content type
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {
        Bucket: bucket,
        Key: key,
    };
    try {
        const { ContentType } = await s3.getObject(params).promise();
        console.log('CONTENT TYPE:', ContentType);
        return ContentType;
    } catch (err) {
        console.log(err);
        const message = `Error getting object ${key} from bucket ${bucket}. Make sure they exist and your bucket is in the same region as this function.`;
        console.log(message);
        throw new Error(message);
    }
};

*/


/* 
Feature Tasks 
* X Create an S3 Bucket with “open” read permissions, so that anyone can see the images/files in their browser

* X A user should be able to upload an image at any size, and update a dictionary of all images that have been uploaded so far

* ~ When an image is uploaded to your S3 bucket, it should trigger a Lambda function which must:

    * Download a file called “images.json” from the S3 Bucket if it exists
    * The images.json should be an array of objects, each representing an image. Create an empty array if this file is not present
    * Create a metadata object describing the image
        * Name, Size, Type, etc.

    * Append the data for this image to the array
        * Note: If the image is a duplicate name, update the object in the array, don’t just add it
    * Upload the images.json file back to the S3 bucket
*/

/* 

Jacob's index.js from class demo

exports.handler = async (event) => {
    
    console.log(s3);
    let bucket = event["Records"][0]["s3"]["bucket"];
    let object = event["Records"][0]["s3"]["object"];
    console.log(bucket, object);
    
    const response = {
        statusCode: 200,
        body: JSON.stringify('Hello from Lambda!'),
    };
    return response;
};

*/
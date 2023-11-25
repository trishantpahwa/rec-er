const AWS = require("aws-sdk");

const s3 = new AWS.S3();

module.exports = async (event, context) => {
    try {
        console.log(event);
        const buckets = await s3.listBuckets().promise();
        console.log(buckets);
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Hello World"
            })
        };
    } catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Internal Server Error"
            })
        };
    }
};
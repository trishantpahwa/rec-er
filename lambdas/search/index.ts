import { S3 } from "aws-sdk"
import { APIGatewayProxyEvent, APIGatewayProxyResultV2, Handler } from 'aws-lambda';

const s3 = new S3();

export const handler: Handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResultV2> => {
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
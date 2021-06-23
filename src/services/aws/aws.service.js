import AWS from 'aws-sdk';

AWS.config.update({
    // eslint-disable-next-line no-undef
    accessKeyId: proccess.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_KEY,
    region: 'ap-south-1'
});

export default AWS;
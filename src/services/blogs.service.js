import YAML from 'yaml';

import { S3Service } from './aws';

const BlogsService = {
    getMetaDataList: async () => {
        const blogsList = await S3Service.listObjects('meta')
        let _blogs = await Promise.all(blogsList.map(async blog => {
            const file = await S3Service.getObject(blog);
            return YAML.parse(file.Body.toString());
        }));
        let blogs = {};
        for (var i = 0; i < blogsList.length; i++) {
            blogs[blogsList[i].split('/')[1].split('.')[0]] = _blogs[i];
        }
        return blogs;
    },
    getBlogFiles: async (blog) => {
        let filesList = await S3Service.listObjects(blog);
        filesList = filesList.filter(file => file.slice(file.length-2, file.length) === 'md')
        const files = await Promise.all(filesList.map(async file => {
            const _file = await S3Service.getObject(file);
            return _file.Body;
        }));
        let _files = {};
        for (var i = 0; i < files.length; i++) {
            _files[filesList[i].split('/')[1]] = files[i];
        }
        return _files;
    }
};

export default BlogsService;
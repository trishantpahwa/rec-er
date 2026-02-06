import YAML from 'yaml'; // Remove package => @trishantpahwa | 2026-02-06 20:30:01

import { S3Service } from './aws';

const BlogsService = {
    getMetaDataList: async () => {
        try {
            const response = await fetch('/api/blog/metadata');
            const data = await response.json();
            const blogs = {};
            for (const item of data) {
                let blogMeta = {
                    Title: data.title,
                };
                blogs[blogId] = blogMeta;
            }
            return blogs;
        } catch (error) {
            console.error('Error fetching blog metadata:', error);
            return {};
        }
    },
    getBlogFiles: async (blog) => {
        let filesList = await S3Service.listObjects(blog);
        filesList = filesList.filter(file => file.slice(file.length - 2, file.length) === 'md')
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
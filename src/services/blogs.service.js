const BlogsService = {
    getMetaDataList: async () => {
        try {
            const response = await fetch(`/api/blog/metadata`);
            const data = await response.json();
            const blogs = {};
            for (const item of data) {
                let blogMeta = {
                    Title: item.title,
                };
                blogs[item.id] = blogMeta;
            }
            return blogs;
        } catch (error) {
            console.error('Error fetching blog metadata:', error);
            return {};
        }
    },
    getBlog: async (blog) => {
        try {
            const response = await fetch(`/api/blog/${blog}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching blog files:', error);
            return {};
        }
    }
};

export default BlogsService;
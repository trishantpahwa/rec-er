const BlogsService = {
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
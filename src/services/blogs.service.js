const BlogsService = {
    searchBlog: async (searchQuery) => {
        try {
            const response = await fetch(`/api/blog?search=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Error fetching blog files:', error);
            return {};
        }
    }
};

export default BlogsService;
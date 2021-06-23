import { BlogsConstants } from '../constants';
import { BlogsService } from '../services';

const BlogsActions = {
    getAllBlogsAction: () => {
        const request = () => ({ type: BlogsConstants.GET_ALL_BLOGS_METADATA_REQUEST });
        const success = (metaData) => ({ type: BlogsConstants.GET_ALL_BLOGS_METADATA_SUCCESS, metaData });
        const failure = () => ({ type: BlogsConstants.GET_ALL_BLOGS_METADATA_FAILURE });

        return async (dispatch) => {
            try {
                dispatch(request());
                const metaData = await BlogsService.getMetaDataList();
                dispatch(success(metaData));
            } catch (err) {
                console.log(err);
                dispatch(failure());
            }
        };
    },
    getBlogFiles: (blog) => {
        const request = () => ({ type: BlogsConstants.GET_BLOG_FILES_REQUEST });
        const success = (files) => ({ type: BlogsConstants.GET_BLOG_FILES_SUCCESS, files });
        const failure = () => ({ type: BlogsConstants.GET_BLOG_FILES_FAILURE });
        
        return async (dispatch) => {
            try {
                dispatch(request());
                const files = await BlogsService.getBlogFiles(blog);
                dispatch(success(files));
            } catch (err) {
                console.log(err);
                dispatch(failure());
            }
        };
    }
};

export default BlogsActions;
import { BlogsConstants } from '../constants';

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case BlogsConstants.GET_ALL_BLOGS_METADATA_REQUEST:
            return { ...state };
        case BlogsConstants.GET_ALL_BLOGS_METADATA_SUCCESS:
            return { ...state, metaData: action.metaData };
        case BlogsConstants.GET_ALL_BLOGS_METADATA_FAILURE:
            return { ...state };
        
        case BlogsConstants.GET_BLOG_FILES_REQUEST:
            return { ...state };
        case BlogsConstants.GET_BLOG_FILES_SUCCESS:
            return { ...state, files: action.files };
        case BlogsConstants.GET_BLOG_FILES_FAILURE:
            return { ...state };
        default:
            return state;
    }
};

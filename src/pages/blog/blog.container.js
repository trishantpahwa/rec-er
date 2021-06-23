import marked from 'marked';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BlogsActions } from '../../actions';
import BlogView from './blog.view';

function BlogContainer(props) {
	const dispatch = useDispatch();
	const blogFiles = useSelector((state) => !!state.blogs && !!state.blogs.files && state.blogs.files) || null;
	const [ data, setData ] = useState('');

	useEffect(() => {
		dispatch(BlogsActions.getBlogFiles(props.match.params.id));
	}, []);

	useEffect(
		() => {
			if (blogFiles) setData(marked(blogFiles['data.md'].toString()));
		},
		[ blogFiles ]
	);
	return (
		<div>
			<BlogView data={data} files={blogFiles} />
		</div>
	);
}

export default BlogContainer;

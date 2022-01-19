import marked from 'marked';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BlogsActions } from '../../actions';
import BlogView from './blog.view';

function BlogContainer(props) {
	const dispatch = useDispatch();
	const blogFiles = useSelector((state) => !!state.blogs && !!state.blogs.files && state.blogs.files) || null;
	const [ data, setData ] = useState('');

	const replaceCodePenTag = (md) => {
		const codePenHashRegex = new RegExp("<codepen src=\"(.*)\"\ />", 'gm');
		const codePenHash = md.match(codePenHashRegex);
		let hash;
		if(codePenHash && codePenHash.length) {
			codePenHash.forEach((_codePenHash) => {
				hash = _codePenHash.split('"')[1].split('/').pop();
				md = md.replace(_codePenHash, `<iframe class="codepen-iframe" scrolling="no" src="https://codepen.io/trishantpahwa/embed/` + hash + `?default-tab=js%2Cresult" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">See the Pen <a href="https://codepen.io/trishantpahwa/pen/">` + hash + `Solution1</a> by Trishant Pahwa (<a href="https://codepen.io/trishantpahwa">@trishantpahwa</a>)on <a href="https://codepen.io">CodePen</a>.</iframe>`);
			})
		}
		return md;
	}

	useEffect(() => {
		dispatch(BlogsActions.getBlogFiles(props.match.params.id));
	}, []);

	useEffect(
		() => {
			if (blogFiles) setData(replaceCodePenTag(marked(blogFiles['data.md'].toString())));
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

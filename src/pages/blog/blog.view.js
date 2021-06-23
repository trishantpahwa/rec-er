function BlogView(props) {
	return (
		<div className="blogView">
			<div className="markdown-to-html" dangerouslySetInnerHTML={{ __html: props.data }} />
		</div>
	);
}

export default BlogView;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { BlogsActions } from "../../actions";
import BlogView from "./blog.view";

function BlogContainer(props) {
  const dispatch = useDispatch();
  const blogFiles =
    useSelector(
      (state) => !!state.blogs && !!state.blogs.files && state.blogs.files
    ) || null;
  const [data, setData] = useState([]);
  const [codePens, setCodePens] = useState([]);

  const getCodePens = (md) => {
    const codePenHashRegex = new RegExp('<codepen src="(.*)" />', "gm");
    const codePenHash = md.match(codePenHashRegex);
    if (codePenHash && codePenHash.length) {
      return codePenHash.map((_codePenHash) =>
        _codePenHash.split('"')[1].split("/").pop()
      );
    } else return [];
  };

  useEffect(() => {
    dispatch(BlogsActions.getBlogFiles(props.match.params.id));
  }, []);

  useEffect(() => {
    if (blogFiles) {
      setCodePens(getCodePens(blogFiles["data.md"].toString()));
      setData(
        blogFiles["data.md"].toString().split(/<codepen src=\".*\"\ \/>/)
      );
    }
  }, [blogFiles]);
  return (
    <div>
      <BlogView markdownData={data} codePens={codePens} />
    </div>
  );
}

export default BlogContainer;

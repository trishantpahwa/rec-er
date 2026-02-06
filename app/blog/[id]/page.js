'use client';

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { BlogsService } from "../../../src/services";

function BlogView(props) {
  const [color, setColor] = useState("green");
  const [backgroundColor, setBackgroundColor] = useState("black");

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setColor(localStorage.getItem("color") || "green");
      setBackgroundColor(localStorage.getItem("background-color") || "black");
    }
  }, []);

  return (
    <div className="blogView" style={{ color: color, backgroundColor: backgroundColor }}>
      {props.markdownData.map((md, i) => (
        <div key={i}>
          <ReactMarkdown>{md}</ReactMarkdown>
          {i < props.markdownData.length - 1 && (
            <iframe
              title={props.id}
              className="codepen-iframe"
              scrolling="no"
              src={
                `https://codepen.io/trishantpahwa/embed/${props.codePens[i]}?default-tab=js%2Cresult`
              }
              frameBorder="no"
              loading="lazy"
              allowtransparency="true"
              allowFullScreen={true}
            >
              See the Pen{" "}
              <a href="https://codepen.io/trishantpahwa/pen/">
                {props.codePens[i]} Solution {i + 1}
              </a>{" "}
              by Trishant Pahwa (
              <a href="https://codepen.io/trishantpahwa">@trishantpahwa</a>) on{" "}
              <a href="https://codepen.io">CodePen</a>.
            </iframe>
          )}
        </div>
      ))}
    </div>
  );
}

function BlogPage({ params }) {
  const [blogData, setBlogData] = useState(null);
  const [blogContent, setBlogContent] = useState([]);
  const [codePens, setCodePens] = useState([]);
  const [id, setId] = useState(null);

  useEffect(() => {
    // Unwrap params in Next.js 15+
    const unwrapParams = async () => {
      const unwrappedParams = await params;
      setId(unwrappedParams.id);
    };
    unwrapParams();
  }, [params]);

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
    if (id) {
      const fetchBlog = async () => {
        try {
          const data = await BlogsService.getBlog(id);
          setBlogData(data);
        } catch (err) {
          console.log('Error fetching blog files:', err);
        }
      };
      fetchBlog();
    }
  }, [id]);

  useEffect(() => {
    if (blogData) {
      setCodePens(getCodePens(blogData.content.toString()));
      setBlogContent(blogData.content.split(/<codepen src=".*" \/>/));
    }
  }, [blogData]);

  return (
    <div className="App">
      <BlogView id={id} markdownData={blogContent} codePens={codePens} />
    </div>
  );
}

export default BlogPage;

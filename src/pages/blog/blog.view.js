import ReactMarkdown from "react-markdown";

function BlogView(props) {
  return (
    <div className="blogView">
      {props.markdownData.map((md, i) => (
        <div key={i}>
			{console.log(md)}
          <ReactMarkdown className="markdown-to-html">{md}</ReactMarkdown>̦
          {i < props.markdownData.length-1 && (
            <iframe
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
                {props.codePens[i]} Solution {i+1}
              </a>{" "}
              by Trishant Pahwa (
              <a href="https://codepen.io/trishantpahwa">@trishantpahwa</a>)on{" "}
              <a href="https://codepen.io">CodePen</a>.
            </iframe>
          )}
        </div>
      ))}
    </div>
  );
}

export default BlogView;

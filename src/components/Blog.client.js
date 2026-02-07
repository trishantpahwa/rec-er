'use client';

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Blog({ id, markdownData, codePens, blogData }) {
  const [color, setColor] = useState("green");
  const [backgroundColor, setBackgroundColor] = useState("black");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setColor(localStorage.getItem("color") || "green");
      setBackgroundColor(localStorage.getItem("background-color") || "black");
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div
      className="min-h-screen w-full overflow-y-auto overflow-x-hidden"
      style={{ color: color, backgroundColor: backgroundColor }}
    >
      {/* Blog Header */}
      {blogData?.title && (
        <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
            {blogData.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm opacity-80">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>Trishant Pahwa</span>
            </div>

            {blogData.createdAt && (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                <time dateTime={blogData.createdAt}>
                  {new Date(blogData.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
            )}
          </div>
        </header>
      )}

      {/* Blog Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {markdownData.map((md, i) => (
          <section key={i} className="mb-8">
            {/* Markdown Content with improved typography */}
            <div className="prose prose-lg prose-invert max-w-none
                          prose-headings:font-bold prose-headings:tracking-tight
                          prose-h1:text-4xl prose-h1:mb-6
                          prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-12
                          prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
                          prose-p:leading-relaxed prose-p:mb-4
                          prose-a:underline prose-a:decoration-2
                          prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:break-words
                          prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-700 prose-pre:overflow-x-auto prose-pre:max-w-full
                          prose-ul:my-4 prose-ol:my-4
                          prose-li:my-2
                          prose-blockquote:border-l-4 prose-blockquote:pl-4 prose-blockquote:italic
                          prose-img:rounded-lg prose-img:shadow-lg
                          [&_pre]:overflow-x-auto [&_pre]:max-w-full [&_code]:break-words">
              <ReactMarkdown>{md}</ReactMarkdown>
            </div>

            {/* CodePen Embed */}
            {i < markdownData.length - 1 && codePens[i] && (
              <div className="my-12">
                <iframe
                  title={`${id}-codepen-${i}`}
                  className="w-full h-[500px] sm:h-[600px] rounded-lg border border-gray-700 shadow-xl"
                  scrolling="no"
                  src={`https://codepen.io/trishantpahwa/embed/${codePens[i]}?default-tab=js%2Cresult&theme-id=dark`}
                  frameBorder="no"
                  loading="lazy"
                  allowTransparency="true"
                  allowFullScreen={true}
                >
                  See the Pen{" "}
                  <a href={`https://codepen.io/trishantpahwa/pen/${codePens[i]}`}>
                    {codePens[i]} Solution {i + 1}
                  </a>{" "}
                  by Trishant Pahwa (
                  <a href="https://codepen.io/trishantpahwa">@trishantpahwa</a>) on{" "}
                  <a href="https://codepen.io">CodePen</a>.
                </iframe>
              </div>
            )}
          </section>
        ))}

        {/* Back to Home Link */}
        <nav className="mt-16 pt-8 border-t border-gray-700">
          <a
            href="/"
            className="inline-flex items-center gap-2 hover:underline"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Home
          </a>
        </nav>
      </main>
    </div>
  );
}

'use client';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

export default function BlogEditor() {
    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);

    const handleEditorChange = (value) => {
        setCode(value || '');
    };

    const publishBlog = async () => {
        if (!code.trim()) {
            alert('Please write some content before publishing!');
            return;
        }

        setIsPublishing(true);
        try {
            const content = code;
            const response = await fetch('/api/publish-blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Blog published successfully!\nTitle: ${title}\nID: ${data.id}`);
                setCode(''); // Clear editor after successful publish
            } else {
                alert(`Failed to publish blog: ${data.error}\n${data.details || ''}`);
            }
        } catch (error) {
            console.error('Error publishing blog:', error);
            alert(`Error publishing blog: ${error.message}`);
        } finally {
            setIsPublishing(false);
        }
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-500">
            {/* Clean Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-xl font-semibold text-slate-900">Blog Editor</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={publishBlog}
                            disabled={isPublishing}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {isPublishing ? 'Publishing...' : 'Publish'}
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex flex-row min-h-0">
                {/* Editor Panel */}
                <div className="w-1/2 flex flex-col bg-slate-900 border-r border-slate-300">
                    <div className="px-4 py-3 bg-slate-800 border-b border-slate-700">
                        <h2 className="text-sm font-medium text-slate-300">Editor</h2>
                    </div>
                    <div className="flex-1 p-4">
                        <input type="text" placeholder="Blog Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-11/12 rounded-lg mb-4 p-2 border border-slate-700 bg-slate-800 text-slate-200" />
                        <Editor
                            height="99vh"
                            width="50vw"
                            theme="vs-dark"
                            value={code}
                            onChange={handleEditorChange}
                            defaultLanguage="markdown"
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                padding: { top: 16, bottom: 16 },
                                wordWrap: "on",
                                tabSize: 2,
                                insertSpaces: true,
                                smoothScrolling: true,
                                cursorBlinking: "smooth",
                            }}
                        />
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="w-1/2 flex flex-col">
                    <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                        <h2 className="text-sm font-medium text-slate-700">Live Preview</h2>
                    </div>
                    <div className="flex-1 overflow-auto p-6">
                        <div className="max-w-3xl mx-auto">
                            {code.trim() ? (
                                <div className="prose prose-slate max-w-none">
                                    <ReactMarkdown>
                                        {code}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center py-12">
                                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-2xl">📝</span>
                                    </div>
                                    <h3 className="text-lg font-medium text-slate-600 mb-2">Start writing your blog</h3>
                                    <p className="text-slate-500 max-w-sm">
                                        Type markdown in the editor on the left to see your content rendered here in real-time.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
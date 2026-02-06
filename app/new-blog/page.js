'use client';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

export default function BlogEditor() {
    const [code, setCode] = useState("");

    const handleEditorChange = (value) => {
        setCode(value || '');
    };

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-500">
            {/* Clean Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-xl font-semibold text-slate-900">Blog Editor</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button className="px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors font-medium">
                            Save Draft
                        </button>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors font-medium">
                            Publish
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
                        <Editor
                            height="50vh"
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
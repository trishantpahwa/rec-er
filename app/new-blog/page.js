'use client';
import Editor from '@monaco-editor/react';
import ReactMarkdown from 'react-markdown';
import { useState, useRef } from 'react';

export default function BlogEditor() {
    const [code, setCode] = useState("");
    const [title, setTitle] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState("");
    const [showPublishModal, setShowPublishModal] = useState(false);
    const [publishPassword, setPublishPassword] = useState("");
    const fileInputRef = useRef(null);

    const handleEditorChange = (value) => {
        setCode(value || '');
    };

    const publishBlog = async () => {
        if (!code.trim()) {
            alert('Please write some content before publishing!');
            return;
        }

        setShowPublishModal(true);
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.');
            return;
        }

        // Validate file size (5MB limit)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            alert('File too large. Maximum size is 5MB.');
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);

            const response = await fetch('/api/upload/image', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                // Insert image markdown at cursor position or end of document
                const imageMarkdown = `![${data.fileName}](${data.imageUrl})\n`;
                setCode(prevCode => prevCode + imageMarkdown);
            } else {
                alert(`Failed to upload image: ${data.error}`);
            }
        } catch (error) {
            alert(`Error uploading image: ${error.message}`);
        } finally {
            setIsUploading(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const triggerImageUpload = () => {
        fileInputRef.current?.click();
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (password === process.env.NEXT_PUBLIC_BLOG_UI_PASSWORD) {
            setIsAuthenticated(true);
        } else {
            alert('Incorrect password');
        }
    };

    const handlePublishConfirm = async (e) => {
        e.preventDefault();
        if (publishPassword === "") {
            alert('Incorrect publish password');
            return;
        }

        setShowPublishModal(false);
        setPublishPassword("");

        setIsPublishing(true);
        try {
            const content = code;
            const response = await fetch('/api/blog', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content, password: publishPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Blog published successfully!\nTitle: ${title}\nID: ${data.id}`);
                setCode('');
            } else {
                alert(`Failed to publish blog: ${data.error}\n${data.details || ''}`);
            }
        } catch (error) {
            console.error('Error publishing blog:', error);
            alert(`Error publishing blog: ${error.message}`);
        } finally {
            setIsPublishing(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-slate-500">
                <div className="bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Enter Password</h2>
                    <form onSubmit={handlePasswordSubmit}>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded mb-4"
                            placeholder="Password"
                        />
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-slate-500">
            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/gif,image/webp"
                style={{ display: 'none' }}
            />

            {/* Clean Header */}
            <header className="bg-white border-b border-slate-200 px-6 py-4 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h1 className="text-xl font-semibold text-slate-900">Blog Editor</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={triggerImageUpload}
                            disabled={isUploading}
                            className="px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors font-medium disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                            <span>📷</span>
                            <span>{isUploading ? 'Uploading...' : 'Upload Image'}</span>
                        </button>
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

            {/* Publish Confirmation Modal */}
            {showPublishModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold mb-4">Confirm Publish</h2>
                        <p className="mb-4">Enter the publish password to confirm publishing this blog.</p>
                        <form onSubmit={handlePublishConfirm}>
                            <input
                                type="password"
                                value={publishPassword}
                                onChange={(e) => setPublishPassword(e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded mb-4"
                                placeholder="Publish Password"
                                autoFocus
                            />
                            <div className="flex space-x-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowPublishModal(false); setPublishPassword(""); }}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Publish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
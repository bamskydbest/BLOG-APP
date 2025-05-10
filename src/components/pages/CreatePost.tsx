import React, { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";

export interface Post {
  id?: number;
  title?: string;
  author?: string;
  content?: string;
  imageUrl?: string;
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title && !author && !content && !imageUrl) {
      alert("Please add text or an image URL before submitting.");
      return;
    }

    const payload: Post = {
      title: title || undefined,
      author: author || undefined,
      content: content || undefined,
      imageUrl: imageUrl || undefined,
    };

    try {
      const res = await fetch("http://localhost:3000/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      navigate("/");
    } catch (err) {
      console.error("Submission error:", err);
      alert("Failed to create post. Check console for details.");
    }

    // reset form
    setTitle("");
    setAuthor("");
    setContent("");
    setImageUrl("");
  };

  return (
    <div className="p-6 bg-[#E8C999] max-w-xl mx-auto mt-6">
      <Link to="/" className="text-[#8E1616] underline">
        &larr; Back to Home
      </Link>
      <h1 className="text-2xl mb-4 mt-4 font-[cursive] font-extrabold">
        Create a Post
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div className="mt-4">
          <label htmlFor="title" className="block font-medium">
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Author Input */}
        <div className="mt-4">
          <label htmlFor="author" className="block font-medium">
            Author:
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Content Textarea */}
        <div className="mt-4">
          <label htmlFor="content" className="block font-medium">
            Content:
          </label>
          <textarea
            id="content"
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border p-2 rounded resize-none"
          />
        </div>

        {/* Image URL Input */}
        <div className="mt-4">
          <label htmlFor="imageUrl" className="block font-medium">
            Image URL:
          </label>
          <input
            id="imageUrl"
            type="text"
            placeholder="https://example.com/image.jpg"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        {imageUrl && (
          <div className="mt-4">
            <p className="font-medium">Image Preview:</p>
            <img
              src={imageUrl}
              alt="Preview"
              className="mt-2 max-h-60 rounded object-cover w-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "";
              }}
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="flex space-x-4 mt-4">
          <button
            type="submit"
            className="bg-[#8E1616] text-white px-4 py-2 rounded mr-4"
          >
            Submit
          </button>
          <Link
            to="/"
            className="px-4 py-2 border rounded text-[#8E1616] hover:bg-[#f0e4d9]"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;

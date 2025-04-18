import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { BiEdit } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { useParams, Link, useNavigate } from "react-router-dom";

interface Post {
  id: number;
  title?: string;
  author?: string;
  content?: string;
  imageUrl?: string;
}

const HomeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<
    Pick<Post, "title" | "author" | "content">
  >({ title: "", author: "", content: "" });

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:3000/blog/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error fetching post: ${res.statusText}`);
        return res.json();
      })
      .then((data: Post) => {
        setPost(data);
        setFormData({
          title: data.title || "",
          author: data.author || "",
          content: data.content || "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleEdit = () => setIsEditing(true);

  const handleCancel = () => {
    if (post) {
      setFormData({
        title: post.title || "",
        author: post.author || "",
        content: post.content || "",
      });
    }
    setIsEditing(false);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!post) return;
    try {
      const res = await fetch(`http://localhost:3000/blog/${post.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...post, ...formData }),
      });
      if (!res.ok) throw new Error("Failed to update post");
      const updated: Post = await res.json();
      setPost(updated);
      setIsEditing(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Update error");
    }
  };

  const handleDelete = async () => {
    if (!post) return;
    try {
      const res = await fetch(`http://localhost:3000/blog/${post.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Deletion error");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;
  if (!post) return <p className="p-6 text-center">Post not found.</p>;

  return (
    <div className="p-6 bg-[#E8C999] max-w-xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <Link to="/" className="text-[#8E1616] underline">
          &larr; Back to Home
        </Link>
        <div className="flex space-x-4">
          <button type="button" onClick={handleEdit} aria-label="Edit Post">
            <BiEdit size={20} className="" />
          </button>
          <button type="button" onClick={handleDelete} aria-label="Delete Post">
            <BsTrash size={20} className="text-[#8E1616] ml-[2rem] " />
          </button>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-medium">
              Title:
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="author" className="block font-medium">
              Author:
            </label>
            <input
              id="author"
              name="author"
              type="text"
              value={formData.author}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label htmlFor="content" className="block font-medium">
              Content:
            </label>
            <textarea
              id="content"
              name="content"
              rows={6}
              value={formData.content}
              onChange={handleChange}
              className="w-full border p-2 rounded resize-none"
            />
          </div>
          <div className="flex space-x-4 mt-[2rem]">
            <div className="mr-[2rem]">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={`Post ${post.id}`}
              className="w-full max-h-96 object-cover rounded mb-4"
            />
          )}
          {post.title && (
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          )}
          {post.author && <p className="italic mb-4">By {post.author}</p>}
          {post.content && (
            <p className="leading-relaxed whitespace-pre-line">
              {post.content}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default HomeDetails;

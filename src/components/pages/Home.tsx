import React, { useState, useEffect, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { Post } from "./CreatePost";

const Home: React.FC = () => {
  document.title = "Blog App/home";
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetch("http://localhost:3000/blog")
      .then((res) => res.json())
      .then((data: Post[]) => setPosts(data))
      .catch((err) => console.error("Error loading posts:", err));
  }, []);

  const getPreview = (text: string) => {
    const words = text.split(/\s+/);
    return words.length <= 30 ? text : words.slice(0, 30).join(" ") + "...";
  };

  const filtered = posts.filter(
    (p) =>
      (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.author && p.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const capitalize = (s: string) =>
    s
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(" ");

  return (
    <div className="p-6 bg-[#E8C999] max-w-xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-[cursive] font-extrabold">Blog Posts</h1>
        <Link
          to="/create"
          className="bg-[#8E1616] text-white px-4 py-2 rounded hover:opacity-90"
        >
          Create Post
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search by title or author"
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
        className="w-full border p-2 rounded mb-6"
      />

      {filtered.length > 0 ? (
        <ul className="space-y-6 mt-[2rem]">
          {filtered.map((post) => (
            <li
              key={post.id}
              className="p-4 border-4 border-[#8E1616] bg-[#F8EEDF] rounded-xl mt-[2rem]"
            >
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="mb-2 max-h-20 w-[20%] object-cover rounded"
                />
              )}
              {post.title && (
                <h2 className="font-bold text-xl">{capitalize(post.title)}</h2>
              )}
              {post.author && (
                <p className="italic">By {capitalize(post.author)}</p>
              )}
              {post.content && (
                <p className="mt-2">
                  {capitalize(getPreview(post.content))}{" "}
                  {post.content.split(/\s+/).length > 30 && (
                    <Link
                      to={`/post/${post.id}`}
                      className="text-[#8E1616] underline"
                    >
                      Read more
                    </Link>
                  )}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-600">No posts found.</p>
      )}
    </div>
  );
};

export default Home;

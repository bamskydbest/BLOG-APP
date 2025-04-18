import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { Link } from "react-router-dom";

interface HomeProps {
  username: string;
}

interface Post {
  id: number;
  title?: string;
  author?: string;
  content?: string;
  imageUrl?: string;
}

const Home: React.FC<HomeProps> = () => {
  const [title, setTitle] = useState<string>("");
  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Helper to convert File to Base64 string (unchanged)
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  // Load existing posts (expects db.json items to have imageUrl field)
  useEffect(() => {
    fetch("http://localhost:3000/blog")
      .then((res) => res.json())
      .then((data: Post[]) => {
        setPosts(data);
      })
      .catch((err) => console.error("Error loading posts:", err));
  }, []);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!title && !author && !content && !imageFile) {
      alert("Please provide some text or select an image before submitting.");
      return;
    }

    let imageUrl: string | undefined;
    if (imageFile) {
      try {
        imageUrl = await fileToBase64(imageFile);
      } catch (err) {
        console.error("Error converting file:", err);
      }
    }

    const payload = {
      title: title || undefined,
      author: author || undefined,
      content: content || undefined,
      imageUrl,
    };

    try {
      const response = await fetch("http://localhost:3000/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const saved: Post = await response.json();
      setPosts((prev) => [...prev, saved]);
    } catch (error) {
      console.error("Submission error:", error);
    }

    setTitle("");
    setAuthor("");
    setContent("");
    setImageFile(null);
  };

  // display 30 words only from the post

  const getPreview = (text: string) => {
    const words = text.split(/\s+/);
    if (words.length <= 30) return text;
    return words.slice(0, 30).join(" ") + "...";
  };
  //filtering post for search functionality
  const filteredPosts = posts.filter(
    (post) =>
      (post.title &&
        post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (post.author &&
        post.author.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // capitalize the first letter of each word for title and author

  const capitalizeWords = (str: string): string =>
    str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  //capitalize the first letter for the content
  const capitalizeFirstLetter = (str: string): string =>
    str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <div className="p-6 bg-[#E8C999] max-w-xl mx-auto mt-6">
      <h1 className="text-2xl mb-4">Create a post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="m-[2rem]">
          <label htmlFor="title" className="block font-medium">
            Title:
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
            className="w-full border p-2"
          />
        </div>
        <div className="m-[2rem]">
          <label htmlFor="author" className="block font-medium">
            Author:
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAuthor(e.target.value)
            }
            className="w-full border p-2"
          />
        </div>
        <div className="m-[2rem]">
          <label htmlFor="content" className="block font-medium">
            Content:
          </label>
          <textarea
            id="content"
            name="content"
            cols={30}
            rows={10}
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setContent(e.target.value)
            }
            className="w-full border p-2 resize-none"
          />
        </div>
        <div className="m-[2rem]">
          <label htmlFor="content-picture" className="block font-medium">
            Upload Image:
          </label>
          <input
            type="file"
            id="content-picture"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border p-2"
          />
        </div>
        {imageFile && (
          <div className="m-[2rem]">
            <p className="block font-medium">Image Preview:</p>
            <img
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              className="mt-2 max-h-60 rounded"
            />
          </div>
        )}
        <button
          type="submit"
          className="bg-[#8E1616] text-white px-4 py-2 rounded block m-auto"
        >
          Submit Post
        </button>
      </form>
      <input
        type="text"
        placeholder="Search by title or author"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border p-2 mb-4 mt-4 "
      />

      {filteredPosts.length > 0 ? (
        <div className="mt-8">
          <h2 className="text-xl mb-4">Existing Posts</h2>
          <ul className="space-y-6">
            {filteredPosts.map((post) => (
              <li
                key={post.id}
                className="p-4 border-[8px] border-[#8E1616] rounded-xl bg-[#F8EEDF] mb-2"
              >
                {post.imageUrl && (
                  <img
                    src={post.imageUrl}
                    alt={`Post ${post.id}`}
                    className="max-h-48 mb-2 rounded"
                  />
                )}
                {post.title && (
                  <h3 className="font-bold">
                    {capitalizeWords(post.title)}
                    {/* {post.title} */}
                  </h3>
                )}
                {post.author && (
                  <p className="italic">By {capitalizeWords(post.author)}</p>
                )}
                {post.content && (
                  <p className="mt-2">
                    {capitalizeFirstLetter(getPreview(post.content))}{" "}
                    {post.content.split(/\s+/).length > 30 && (
                      <Link
                        to={`/post/${post.id}`}
                        className="text-[#8E1616] underline whitespace-nowrap"
                      >
                        click to see more
                      </Link>
                    )}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="mt-8 text-center text-gray-500">No posts found.</p>
      )}
    </div>
  );
};

export default Home;

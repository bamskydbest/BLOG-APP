import React, { useState, ChangeEvent, FormEvent } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import log from "./assets/Images/BLOG.png";
import "./App.css";
import Nav from "./components/Nav";
import Home from "./components/pages/Home";
import { BsGithub, BsInstagram, BsLinkedin, BsWhatsapp } from "react-icons/bs";
import HomeDetails from "./components/pages/HomeDetails";

const App: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const formatUsername = (name: string) =>
    name ? name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() : "";

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8EED7]">
      <header>
        <div className="flex items-center p-4 border-b">
          <img src={log} alt="logo" className="w-16 h-16 mr-4" />
          <Nav />
        </div>
      </header>

      <main className="flex-grow">
        {!submitted ? (
          <div className="p-8">
            <h1 className="text-3xl mb-6 text-center text-[#E8C999]">
              Please Fill The Form Below
            </h1>
            <form
              onSubmit={handleSubmit}
              className=" w-full max-w-md bg-black p-8 mx-auto rounded"
            >
              <label
                htmlFor="usernameInput"
                className="block text-[#E8C999] text-lg mb-2"
              >
                Enter a username:
              </label>
              <input
                id="usernameInput"
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Your username"
                required
                className="w-full border-2 border-gray-300 p-2 mb-4 rounded text-[#E8C999]"
              />
              <button
                type="submit"
                className="w-full bg-[#8E1616] text-[#E8C999] hover:bg-[#F8EED7] p-3 rounded-md"
              >
                Submit
              </button>
            </form>
          </div>
        ) : (
          <div className="p-8">
            {/* w-[30%] mb-[5rem] */}
            <div className=" w-full md:w-1/2 lg:w-1/3 mb-20 ">
              <h2 className="text-2xl text-[#E8C999] mb-4 ">
                Hello,{" "}
                <b className="text-[#8E1616] ">{formatUsername(username)}!</b>{" "}
                Welcome to a world of endless possibilities. Explore our
                selection of blogs and articles crafted to enrich your life.
              </h2>
            </div>
            {/* Your routes live *inside* the submitted area */}
            <Routes>
              {/* Home page (with the post-creation form) */}
              <Route path="/" element={<Home username={username} />} />

              {/* If user tries a route that doesn't exist, stay on Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
              <Route path="/post/:id" element={<HomeDetails />} />
            </Routes>
          </div>
        )}
      </main>

      <footer className="bg-black text-[#F8EEDF] p-6 text-center flex flex-col md:flex-row md:items-center md:justify-between">
        {/* Logo */}
        <div className="flex justify-center md:justify-start mb-4 md:mb-0">
          <img src={log} alt="footer-logo" className="w-16 h-16" />
        </div>

        {/* Social Icons */}
        <div className="flex justify-center space-x-6 mb-4 md:mb-0">
          <a
            href="https://www.instagram.com/bamsky_dbest/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsInstagram className="text-2xl text-[#E8C999] hover:text-[#8E1616] transition-colors duration-300 mr-[2rem]" />
          </a>
          <a
            href="https://www.linkedin.com/in/mahmoud-abdulmajeed-taiye"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsLinkedin className="mr-[2rem] text-2xl text-[#E8C999] hover:text-[#8E1616] transition-colors duration-300" />
          </a>
          <a
            href="https://github.com/bamskydbest"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsGithub className=" mr-[2rem] text-2xl text-[#E8C999] hover:text-[#8E1616] transition-colors duration-300" />
          </a>
          <a
            href="https://wa.link/i1gkek"
            target="_blank"
            rel="noopener noreferrer"
          >
            <BsWhatsapp className=" mr-[2rem] text-2xl text-[#E8C999] hover:text-[#8E1616] transition-colors duration-300" />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-sm text-[#E8C999]">
          &copy; 2025 Mahmoud Abdulmajeed Taiye. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;

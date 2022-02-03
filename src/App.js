import React, { useState, useEffect, useRef } from "react";

import Blog from "./components/Blog";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import BlogForm from "./components/BlogForm";
import Toggle from "./components/Toggle";

import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  // Blog State
  const [blogs, setBlogs] = useState([]);

  // Login State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Error Message State
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBloglistUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem("loggedBloglistUser", JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername("");
      setPassword("");
      setSuccessMessage(`Welcome, ${user.name}!`);
      setErrorMessage(null);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage("wrong credentials");
      setSuccessMessage(null);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    window.localStorage.clear();
    setErrorMessage(`${user.name} has logged out`);
    setSuccessMessage(null);
    setTimeout(() => {
      setErrorMessage(null);
    }, 5000);
    setUser(null);
  };

  const createBlog = (BlogToAdd) => {
    blogFormRef.current.toggleVisibility();
    try {
      blogService.create(BlogToAdd).then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setSuccessMessage(
          `${BlogToAdd.title} has been added to the blog list!`
        );
        setErrorMessage(null);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      });
    } catch (exception) {
      setErrorMessage("there are missing fields");
      setSuccessMessage(null);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const updateBlog = async (blogToUpdate) => {
    try {
      const updatedBlog = await blogService.update(blogToUpdate);
      setSuccessMessage(
        `Blog ${blogToUpdate.title} has been successfully updated`
      );
      setBlogs(
        blogs.map((blog) => (blog.id !== blogToUpdate.id ? blog : updatedBlog))
      );
      setErrorMessage(null);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      console.log(exception);
      setErrorMessage(`Cannot update blog ${blogToUpdate.title}`);
      setSuccessMessage(null);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  };

  const blogFormRef = useRef();

  const blogForm = () => (
    <Toggle buttonLabel="Add Blog" ref={blogFormRef}>
      <BlogForm createBlog={createBlog} />
    </Toggle>
  );

  const loginForm = () => (
    <Toggle buttonLabel="log in">
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleSubmit={handleLogin}
      />
    </Toggle>
  );

  return (
    <div>
      <h1>Blogs</h1>
      <Notification
        errorMessage={errorMessage}
        successMessage={successMessage}
      />

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>
            {user.name} logged-in{" "}
            <button onClick={handleLogout} type="submit">
              logout
            </button>
            <div>{blogForm()}</div>
          </p>
        </div>
      )}

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} />
      ))}
    </div>
  );
};

export default App;

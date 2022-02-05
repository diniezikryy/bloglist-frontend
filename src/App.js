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

  const createBlog = async (blogToAdd) => {
    blogFormRef.current.toggleVisibility();
    try {
      const addedBlog = await blogService.create(blogToAdd);
      setSuccessMessage(
        `Blog '${blogToAdd.title}' has been successfully added`
      );
      setBlogs(blogs.concat(addedBlog));
      setErrorMessage(null);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
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
        // if current blog element is not the updated blog element, return the old blog element
        // else if it tis, return the new updated blog
        blogs.map((blog) => (blog.id !== blogToUpdate.id ? blog : updatedBlog))
      );
      setErrorMessage(null);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (exception) {
      setErrorMessage(`Cannot update blog ${blogToUpdate.title}`);
      setSuccessMessage(null);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    }
  };

  const removeBlog = async (blogToRemove) => {
    try {
      if (window.confirm(`Delete ${blogToRemove.title} ?`)) {
        blogService.remove(blogToRemove.id);
        setSuccessMessage(
          `Blog ${blogToRemove.title} was successfully deleted`
        );
        setBlogs(blogs.filter((blog) => blog.id !== blogToRemove.id));
        setErrorMessage(null);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
    } catch (exception) {
      console.log(exception);
      setErrorMessage(`Cannot remove blog ${blogToRemove.title}`);
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

  const sortByLikes = (b1, b2) => {
    return b2.likes - b1.likes;
  };

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

      {blogs.sort(sortByLikes).map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          userId={user !== null ? user.id : "Not logged in"}
        />
      ))}
    </div>
  );
};

export default App;

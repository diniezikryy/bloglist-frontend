import React, { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import loginService from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newURL, setNewURL] = useState("");

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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  );

  const createBlog = (event) => {
    event.preventDefault();
    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newURL,
    };

    try {
      blogService.create(blogObject).then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog));
        setSuccessMessage(`${newTitle} has been added to the blog list!`);
        setErrorMessage(null);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        setNewTitle("");
        setNewAuthor("");
        setNewURL("");
      });
    } catch (exception) {
      setErrorMessage("there are missing fields");
      setSuccessMessage(null);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const blogForm = () => (
    <form onSubmit={createBlog}>
      <div>
        Title
        <input
          value={newTitle}
          onChange={(event) => {
            setNewTitle(event.target.value);
          }}
        />
      </div>
      <div>
        Author
        <input
          value={newAuthor}
          onChange={(event) => {
            setNewAuthor(event.target.value);
          }}
        />
      </div>
      <div>
        URL
        <input
          value={newURL}
          onChange={(event) => {
            setNewURL(event.target.value);
          }}
        />
      </div>

      <button type="submit">add</button>
    </form>
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
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;

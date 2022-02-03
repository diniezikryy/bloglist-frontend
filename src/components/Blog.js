import React, { useState } from "react";

const Blog = ({ blog, updateBlog }) => {
  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? "" : "none" };
  const [blogObject, setBlogObject] = useState(blog);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const buttonLabel = visible ? "hide" : "show";

  const increaseLikes = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    updateBlog(updatedBlog);
    setBlogObject(updatedBlog);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  return (
    <div style={blogStyle}>
      <div>
        <p>
          <b>{blogObject.title}</b> by {blogObject.author}{" "}
          <button onClick={toggleVisibility}>{buttonLabel}</button>
        </p>
        <div style={showWhenVisible}>
          <p>Url: {blogObject.url}</p>
          <p>
            Likes: {blogObject.likes}{" "}
            <button onClick={increaseLikes}>like</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;

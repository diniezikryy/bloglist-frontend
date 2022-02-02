import React, { useState } from "react";

const Blog = ({ blog }) => {
  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? "" : "none" };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const buttonLabel = visible ? "hide" : "show";

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
          <b>{blog.title}</b> by {blog.author}{" "}
          <button onClick={toggleVisibility}>{buttonLabel}</button>
        </p>
        <div style={showWhenVisible}>
          <p>Url: {blog.url}</p>
          <p>
            Likes: {blog.likes} <button id="like-button">like</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Blog;

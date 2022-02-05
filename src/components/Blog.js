import React, { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, updateBlog, removeBlog, userId }) => {
  const [visible, setVisible] = useState(false);
  const showWhenVisible = { display: visible ? "" : "none" };
  const [blogObject, setBlogObject] = useState(blog);
  const [blogUserId, setBlogUserId] = useState(blog.user?.id);

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

  const deleteBlog = () => removeBlog(blog);

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const checkLoggedInUser = () => {
    return blogUserId === userId;
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
          <div>
            {checkLoggedInUser() ? (
              <button onClick={deleteBlog}>Delete</button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default Blog;

import React, { useState } from "react";

const BlogForm = ({ createBlog }) => {
  // Add Blog State
  const [newTitle, setNewTitle] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [newURL, setNewURL] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newURL,
    });
    setNewTitle("");
    setNewAuthor("");
    setNewURL("");
  };

  return (
    <form onSubmit={addBlog}>
      <div>
        Title:{" "}
        <input
          id="title"
          value={newTitle}
          onChange={(event) => {
            setNewTitle(event.target.value);
          }}
        />
      </div>
      <div>
        Author:{" "}
        <input
          id="author"
          value={newAuthor}
          onChange={(event) => {
            setNewAuthor(event.target.value);
          }}
        />
      </div>
      <div>
        Url:{" "}
        <input
          id="url"
          value={newURL}
          onChange={(event) => {
            setNewURL(event.target.value);
          }}
        />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

export default BlogForm;

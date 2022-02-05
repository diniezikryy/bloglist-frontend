import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

describe("Blog component tests", () => {
  let blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "reactpatterns.com",
    likes: 11,
  };

  const mockUpdateBlog = jest.fn();
  const mockRemoveBlog = jest.fn();
  const mockUserId = "69smduycimm69";

  test("renders title and author", () => {
    const component = render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        removeBlog={mockRemoveBlog}
        userId={mockUserId}
      />
    );
    expect(component.container).toHaveTextContent(
      "React patterns by Michael Chan"
    );
  });

  test("url and number of likes are shown when button is pressed", () => {
    const component = render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        removeBlog={mockRemoveBlog}
        userId={mockUserId}
      />
    );

    const button = component.getByText("show");
    fireEvent.click(button);

    expect(component.container).toHaveTextContent("reactpatterns.com");
    expect(component.container).toHaveTextContent("11");
  });
});

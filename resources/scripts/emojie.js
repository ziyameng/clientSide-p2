import { drawEmojie } from "./drawEmojie.js";

async function fetchEmojie() {
  const params = new URLSearchParams(window.location.search);

  const res = await fetch(`/api/emojie/${params.get("id")}`);
  const content = await res.json();

  if (!content.id) {
    window.location.href = "/404";
  }

  const container = document.getElementById("emoji-section");
  drawEmojie(container, content, true);

  const interactionSection = document.getElementById("interaction-section");
  if (content.username === localStorage.getItem("username")) {
    interactionSection.innerHTML = `
      <button id="delete-emoji">Delete</button>
    `;
  } else {
    interactionSection.innerHTML = `
    <form id="post-comment">
      <label for="comment-input">Comment</label>
      <textarea id="comment-input" name="comment" cols="60" rows="2"></textarea>
      <label>
        Rating (1-10)
        <input type="number" required min="1" max="10" name="rating" />
      </label>
        <button>post</button>
    </form>
    `;
  }
}

async function fetchComments() {
  const params = new URLSearchParams(window.location.search);

  const res = await fetch(`/api/comments/${params.get("id")}`);
  const content = await res.json();

  const commentsContainer = document.getElementById("emoji-comments");
  commentsContainer.innerHTML = "";

  content.forEach((comment) => {
    const div = document.createElement("div");
    div.className = "comment-container";

    const metaContainer = document.createElement("div");
    metaContainer.innerHTML = `
      <span>${comment.username}</span>
      <span>Rating: ${comment.rating}</span>
      <span>Posted on: ${comment.time}</span>
    `;

    metaContainer.className = "comment-name";
    div.appendChild(metaContainer);

    const comEl = document.createElement("p");
    comEl.className = "comment-content";
    comEl.innerText = comment.comment;
    div.appendChild(comEl);

    commentsContainer.appendChild(div);
  });
}

await fetchEmojie();
await fetchComments();

const form = document.getElementById("post-comment");
if (form) {
  form.onsubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const comment = formData.get("comment");
    const rating = formData.get("rating");

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    try {
      await fetch("/api/comments", {
        method: "POST",
        body: JSON.stringify({
          id,
          comment: {
            comment,
            rating: Number.parseInt(rating),
            username: localStorage.getItem("username") ?? "anonymous",
            time: new Date().toTimeString(),
          },
        }),
        headers: {
          "Content-type": "application/json; chartset=UTF-8",
        },
      });

      form.reset();
      await fetchComments();
    } catch {
      alert("Failed to post comment");
    }
  };
}

const deleteBtn = document.getElementById("delete-emoji");
if (deleteBtn) {
  deleteBtn.onclick = async () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const username = localStorage.getItem("username");
    const pass = localStorage.getItem("password");

    console.log(username, pass);
    try {
      await fetch(`/api/emojies/${id}`, {
        method: "DELETE",
        headers: new Headers({
          Authorization: `Basic ${btoa(`${username}:${pass}`)}`,
        }),
      });

      window.location.href = "/";
    } catch (e) {
      console.log(e);
      alert("Failed to delete post.");
    }
  };
}

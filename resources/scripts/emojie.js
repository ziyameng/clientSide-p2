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
    const nameAndTime = document.createElement("div");
    nameAndTime.className = "comment-name";
    nameAndTime.innerText = `On ${comment.time}, ${comment.username} said`;
    div.appendChild(nameAndTime);

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
form.onsubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const comment = formData.get("comment");

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  try {
    await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({
        id,
        comment: {
          comment,
          username: "anonymous",
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

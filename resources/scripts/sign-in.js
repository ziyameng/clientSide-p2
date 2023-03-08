const signInForm = document.getElementById("sign-in");
const signUpForm = document.getElementById("sign-up");

async function handleSign(event, endpoint) {
  const formData = new FormData(event.target);
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-type": "application/json; chartset=UTF-8",
      },
    });
    if (res.ok) {
      localStorage.setItem("username", username);
      localStorage.setItem("password", password);
      window.location.href = "/";
    } else {
      const resp = await res.json();
      return resp.reason ?? "Failed request - no reason provided by server";
    }
  } catch (e) {
    console.error(e);
  }

  return null;
}

let errorEl = null;
// Form is only present in the sign in page, hence we only set the event listener
// on signInForm if it is defined.
signInForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const resp = await handleSign(event, "/api/sign-in");

  if (resp) {
    if (errorEl) errorEl.remove();

    const errorText = document.createElement("div");
    errorText.className = "error";
    errorText.textContent = resp;

    signInForm.appendChild(errorText);
    errorEl = errorText;
  }
});

signUpForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const resp = await handleSign(event, "/api/sign-up");

  if (resp) {
    if (errorEl) errorEl.remove();

    const errorText = document.createElement("div");
    errorText.className = "error";
    errorText.textContent = resp;

    signUpForm.appendChild(errorText);
    errorEl = errorText;
  }
});

function createSignInSectionHtml() {
  const signInSection = document.getElementById("sign-in-section");
  const username = localStorage.getItem("username");

  // Sign in buttons
  signInSection.innerHTML = "";
  if (username) {
    const name = document.createElement("h2");
    name.innerText = `Welcome ${username}`;
    const signoutButton = document.createElement("button");
    signoutButton.innerText = "Sign Out";
    signoutButton.onclick = () => {
      localStorage.clear();
      createSignInSectionHtml();
    };

    signInSection.appendChild(name);
    signInSection.appendChild(signoutButton);
  } else {
    const link = document.createElement("a");
    link.href = "/sign-in";
    link.innerText = "Sign In/Sign Up";

    signInSection.appendChild(link);
  }
}

createSignInSectionHtml();

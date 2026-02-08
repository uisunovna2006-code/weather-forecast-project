const API = ""; // same origin (frontend served by backend)
let token = localStorage.getItem("token") || "";

const tokenText = document.getElementById("tokenText");
tokenText.textContent = token ? token.slice(0, 18) + "..." : "none";

function setToken(t) {
  token = t;
  localStorage.setItem("token", t);
  tokenText.textContent = t ? t.slice(0, 18) + "..." : "none";
}

async function request(path, method = "GET", body) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(API + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const data = await res.json().catch(() => ({}));

  // 🔴 авто-logout при 401
  if (res.status === 401) {
    doLogout(false);
    throw new Error("Unauthorized. Please login again.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

function updateUI() {
  const isLoggedIn = !!token;

  document.getElementById("btnRegister").style.display = isLoggedIn ? "none" : "inline-block";
  document.getElementById("btnLogin").style.display = isLoggedIn ? "none" : "inline-block";

  document.getElementById("btnProfile").style.display = isLoggedIn ? "inline-block" : "none";
  document.getElementById("btnLogout").style.display = isLoggedIn ? "inline-block" : "none";
}

// 🔐 общий logout
function doLogout(showAlert = true) {
  localStorage.removeItem("token");
  token = "";

  tokenText.textContent = "none";
  document.getElementById("profileOut").textContent = "";
  document.getElementById("weatherOut").textContent = "";
  document.getElementById("locationsOut").textContent = "";

  updateUI();
  if (showAlert) alert("Logged out");
}

/* ===== AUTH ===== */

document.getElementById("btnRegister").onclick = async () => {
  try {
    const username = document.getElementById("r_username").value.trim();
    const email = document.getElementById("r_email").value.trim();
    const password = document.getElementById("r_password").value.trim();

    const data = await request("/api/auth/register", "POST", {
      username,
      email,
      password
    });

    setToken(data.token);
    updateUI();
    alert("Registered!");
  } catch (e) {
    alert(e.message);
  }
};

document.getElementById("btnLogin").onclick = async () => {
  try {
    const email = document.getElementById("l_email").value.trim();
    const password = document.getElementById("l_password").value.trim();

    const data = await request("/api/auth/login", "POST", {
      email,
      password
    });

    setToken(data.token);
    updateUI();
    alert("Logged in!");
  } catch (e) {
    alert(e.message);
  }
};

document.getElementById("btnLogout").onclick = () => doLogout();

/* ===== PROFILE ===== */

document.getElementById("btnProfile").onclick = async () => {
  const out = document.getElementById("profileOut");
  out.textContent = "";
  try {
    const data = await request("/api/users/profile");
    out.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    out.textContent = e.message;
  }
};

/* ===== WEATHER ===== */

document.getElementById("btnWeather").onclick = async () => {
  const out = document.getElementById("weatherOut");
  out.textContent = "";
  try {
    const city = document.getElementById("cityInput").value.trim();
    const data = await request(`/api/weather?city=${encodeURIComponent(city)}`);
    out.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    out.textContent = e.message;
  }
};

/* ===== LOCATIONS (CRUD) ===== */

document.getElementById("btnAddLocation").onclick = async () => {
  const out = document.getElementById("locationsOut");
  out.textContent = "";
  try {
    const name = document.getElementById("locName").value.trim();
    const country = document.getElementById("locCountry").value.trim();
    const notes = document.getElementById("locNotes").value.trim();

    const data = await request("/api/resource", "POST", {
      name,
      country,
      notes
    });

    out.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    out.textContent = e.message;
  }
};

document.getElementById("btnLoadLocations").onclick = async () => {
  const out = document.getElementById("locationsOut");
  out.textContent = "";
  try {
    const data = await request("/api/resource");
    out.textContent = JSON.stringify(data, null, 2);
  } catch (e) {
    out.textContent = e.message;
  }
};

/* ===== INIT ===== */

updateUI();

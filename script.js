const admins = [
  { username: "admin1", password: "admin1" },
  { username: "admin2", password: "admin2" },
  { username: "Md Mazid Hossain", password: "mazid" },
  { username: "Md Mazid Hossain", password: "mazid12" }
];

// Login
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const empId = username.split("-").pop(); // extract from username suffix

    // Check if admin
    const isAdmin = admins.some(admin =>
      admin.username === username &&
      admin.password === password
    );

    if (isAdmin) {
      localStorage.setItem("username", username);
      localStorage.setItem("empId", empId);
      window.location.href = "admin.html";
      return;
    }

    // Employee check via Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbxdD_BgOdPDiv8SBp681stEIMGCrD0pS7RzyU64bjqtD5w2djOow40u0QgrzS_b1lg/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        type: "login",
        username,
        password
      })
    })
      .then(res => res.text())
      .then(text => {
        if (text === "VALID") {
          localStorage.setItem("username", username);
          localStorage.setItem("empId", empId);
          window.location.href = "employee.html";
        } else {
          alert("❌ Invalid credentials");
        }
      })
      .catch(error => {
        console.error("Login Error:", error);
        alert("Something went wrong");
      });
  });
}

// Admin Add Employee
document.getElementById("addEmployeeForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = new FormData(this);
  fetch("https://script.google.com/macros/s/AKfycbxdD_BgOdPDiv8SBp681stEIMGCrD0pS7RzyU64bjqtD5w2djOow40u0QgrzS_b1lg/exec", {
    method: "POST",
    body: data
  }).then(() => {
    document.getElementById("addMessage").textContent = "✅ Employee added";
    this.reset();
  });
});

// Attendance
document.getElementById("checkForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = new FormData(this);
  fetch("https://script.google.com/macros/s/AKfycbxQM4mCXBW6Mh_Z4GrTcs68eIhjlFt3E_yQki58R7nSpl6oldRlRKTh4glUXJ-U6-3Qiw/exec", {
    method: "POST",
    body: data
  }).then(() => {
    document.getElementById("checkMessage").textContent = "✅ Submitted";
    this.reset();
  });
});

// Leave
document.getElementById("leaveForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const data = new FormData(this);
  fetch("https://script.google.com/macros/s/AKfycbx_r3N8sYv7h8F6hnM2JQcwtPP5HhYCgXaXm33GtTJ3LOjMLoFGEdw5k4bKbOPhj19z/exec", {
    method: "POST",
    body: data
  }).then(() => {
    document.getElementById("leaveMessage").textContent = "✅ Leave Submitted";
    this.reset();
  });
});

// Auto-fill employee info
if (location.pathname.includes("employee.html")) {
  const name = localStorage.getItem("username");
  const id = localStorage.getItem("empId");
  document.getElementById("empName")?.setAttribute("value", name);
  document.getElementById("empId")?.setAttribute("value", id);
  document.getElementById("leaveName")?.setAttribute("value", name);
  document.getElementById("leaveEmpId")?.setAttribute("value", id);
}

// Logout
function logout() {
  localStorage.clear();
  location.href = "index.html";
}

// Show profile name
const profileNameElement = document.getElementById("adminProfileName") || document.getElementById("employeeProfileName");
if (profileNameElement) {
  const name = localStorage.getItem("username") || "User";
  profileNameElement.textContent = name;
}

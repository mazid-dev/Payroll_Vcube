const scriptURL = "https://script.google.com/macros/s/AKfycbz1pF9hEzsuNigV6iSXDV4KhDq8ZPMrGcWSy-qZ-wcuJtmgnHEvVFVKv4DZsU5RKlBnaA/exec"; // 🔁 Replace with your Apps Script URL

const admins = [
  { username: "Md Mazid Hossain", password: "mazid" },
  { username: "Adnan", password: "adnan" },
  { username: "jamil", password: "jamil" },
  { username: "fahim", password: "fahim" },
  { username: "riyad", password: "riyad" }
];

let currentUser = null;
let currentRole = null;

function handleLogin() {
  const user = document.getElementById("loginUser").value.trim();
  const pass = document.getElementById("loginPass").value.trim();

  const isAdmin = admins.find(a => a.username === user && a.password === pass);
  if (isAdmin) {
    localStorage.setItem("loggedInUser", JSON.stringify({ user, role: "admin" }));
    window.location.href = "admin.html";
    return;
  }

  // Check Google Sheet for employee
  fetch(`${scriptURL}?action=loginEmployee`, {
    method: "POST",
    body: JSON.stringify({ name: user, password: pass })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      localStorage.setItem("loggedInUser", JSON.stringify({ user, role: "employee" }));
      window.location.href = "employee.html";
    } else {
      alert("❌ Invalid Credentials");
    }
  });
}

function checkLogin(role, redirect = "index.html") {
  const data = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!data || data.role !== role) {
    window.location.href = redirect;
  } else {
    currentUser = data.user;
    currentRole = data.role;
    if (role === "admin") {
      document.getElementById("adminName").innerText = currentUser;
      renderEmployeeList();
    }
  }
}

function logout() {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
}

function addEmployee() {
  const u = document.getElementById("empUsername").value.trim();
  const p = document.getElementById("empPassword").value.trim();
  if (!u || !p) {
    alert("Please fill all fields");
    return;
  }

  fetch(`${scriptURL}?action=addEmployee`, {
    method: "POST",
    body: JSON.stringify({ name: u, password: p })
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      document.getElementById("empMsg").innerText = `✅ Employee '${u}' added.`;
      document.getElementById("empUsername").value = "";
      document.getElementById("empPassword").value = "";
      renderEmployeeList();
    } else {
      alert("❌ Failed to add employee");
    }
  });
}

function renderEmployeeList() {
  fetch(`${scriptURL}?action=getEmployees`)
    .then(res => res.json())
    .then(data => {
      const tbody = document.getElementById("employeeList");
      tbody.innerHTML = "";
      data.forEach((emp, index) => {
        const row = document.createElement("tr");

        const tdUser = document.createElement("td");
        tdUser.textContent = emp[0];

        const tdPass = document.createElement("td");
        tdPass.textContent = emp[1];

        const tdAction = document.createElement("td");
        const btn = document.createElement("button");
        btn.textContent = "❌";
        btn.onclick = () => {
          alert("🛑 Deleting from Google Sheets requires additional scripting.");
        };
        tdAction.appendChild(btn);

        row.appendChild(tdUser);
        row.appendChild(tdPass);
        row.appendChild(tdAction);
        tbody.appendChild(row);
      });
    });
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

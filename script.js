const admins = [
  { username: "Md Mazid Hossain", password: "mazid" },
  { username: "Adnan", password: "adnan" },
  { username: "jamil", password: "jamil" },
  { username: "fahim", password: "fahim" },
  { username: "riyad", password: "riyad" }
];

let employees = JSON.parse(localStorage.getItem("employees")) || [];
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

  const isEmployee = employees.find(e => e.username === user && e.password === pass);
  if (isEmployee) {
    localStorage.setItem("loggedInUser", JSON.stringify({ user, role: "employee" }));
    window.location.href = "employee.html";
    return;
  }

  alert("❌ Invalid Credentials");
}

function checkLogin(role, redirect = "index.html") {
  const data = JSON.parse(localStorage.getItem("loggedInUser"));
  if (!data || data.role !== role) {
    window.location.href = redirect;
  } else {
    currentUser = data.user;
    currentRole = data.role;
    if (role === "admin") document.getElementById("adminName").innerText = currentUser;
    if (role === "admin") renderEmployeeList(); // render employee list on load
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
  employees.push({ username: u, password: p });
  localStorage.setItem("employees", JSON.stringify(employees));
  document.getElementById("empMsg").innerText = `✅ Employee '${u}' added.`;
  document.getElementById("empUsername").value = "";
  document.getElementById("empPassword").value = "";
  renderEmployeeList();
}

function renderEmployeeList() {
  const tbody = document.getElementById("employeeList");
  tbody.innerHTML = "";
  employees.forEach((emp, index) => {
    const row = document.createElement("tr");

    const tdUser = document.createElement("td");
    tdUser.textContent = emp.username;

    const tdPass = document.createElement("td");
    tdPass.textContent = emp.password;

    const tdAction = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
      if (confirm(`Delete ${emp.username}?`)) {
        employees.splice(index, 1);
        localStorage.setItem("employees", JSON.stringify(employees));
        renderEmployeeList();
      }
    };
    tdAction.appendChild(btn);

    row.appendChild(tdUser);
    row.appendChild(tdPass);
    row.appendChild(tdAction);
    tbody.appendChild(row);
  });
}

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

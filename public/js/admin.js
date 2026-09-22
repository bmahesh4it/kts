const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const loginPanel = document.getElementById("login-panel");
const dashboard = document.getElementById("dashboard");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const signOutBtn = document.getElementById("sign-out");
const listEl = document.getElementById("enquiry-list");
const emptyEl = document.getElementById("list-empty");
const tableError = document.getElementById("table-error");
const statusFilter = document.getElementById("status-filter");
const searchInput = document.getElementById("search-input");
const createBtn = document.getElementById("create-btn");
const dialog = document.getElementById("enquiry-dialog");
const enquiryForm = document.getElementById("enquiry-form");
const dialogTitle = document.getElementById("dialog-title");
const dialogError = document.getElementById("dialog-error");
const dialogCancel = document.getElementById("dialog-cancel");

const STATUS_LABELS = {
  new: "New",
  in_progress: "In progress",
  closed: "Closed",
};

let records = [];

function collection() {
  return firebase.firestore().collection("enquiries");
}

function formatDate(timestamp) {
  if (!timestamp?.toDate) return "—";
  return timestamp.toDate().toLocaleString();
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function filteredRecords() {
  const filter = statusFilter.value;
  const query = searchInput.value.trim().toLowerCase();
  return records.filter((item) => {
    const statusOk = filter === "all" || item.status === filter;
    if (!statusOk) return false;
    if (!query) return true;
    return [item.name, item.company, item.email, item.message]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
}

function render() {
  const items = filteredRecords();
  listEl.innerHTML = "";
  emptyEl.hidden = items.length > 0;

  items.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${escapeHtml(formatDate(item.createdAt))}</td>
      <td>${escapeHtml(item.name)}</td>
      <td>${escapeHtml(item.company)}</td>
      <td><a href="mailto:${escapeHtml(item.email)}">${escapeHtml(item.email)}</a></td>
      <td class="cell-message" title="${escapeHtml(item.message)}">${escapeHtml(item.message)}</td>
      <td><span class="status-pill status-${item.status}">${STATUS_LABELS[item.status] || item.status}</span></td>
      <td>
        <div class="row-actions">
          <button class="btn btn-secondary btn-small" type="button" data-edit>Edit</button>
          <button class="btn btn-danger btn-small" type="button" data-delete>Delete</button>
        </div>
      </td>
    `;
    row.querySelector("[data-edit]").addEventListener("click", () => openDialog(item));
    row.querySelector("[data-delete]").addEventListener("click", () => deleteEnquiry(item.id));
    listEl.appendChild(row);
  });
}

function openDialog(item) {
  dialogError.hidden = true;
  enquiryForm.reset();
  enquiryForm.id.value = item?.id || "";
  dialogTitle.textContent = item ? "Edit enquiry" : "New enquiry";
  enquiryForm.name.value = item?.name || "";
  enquiryForm.company.value = item?.company || "";
  enquiryForm.email.value = item?.email || "";
  enquiryForm.message.value = item?.message || "";
  enquiryForm.notes.value = item?.notes || "";
  enquiryForm.status.value = item?.status || "new";
  enquiryForm.language.value = item?.language || "en";
  dialog.showModal();
}

function formPayload() {
  return {
    name: enquiryForm.name.value.trim(),
    company: enquiryForm.company.value.trim(),
    email: enquiryForm.email.value.trim(),
    message: enquiryForm.message.value.trim(),
    notes: enquiryForm.notes.value.trim(),
    status: enquiryForm.status.value,
    language: enquiryForm.language.value,
  };
}

function validatePayload(data) {
  if (data.name.length < 2 || data.name.length > 80) return "Enter a name (2–80 characters).";
  if (data.company.length < 2 || data.company.length > 100) return "Enter a company name (2–100 characters).";
  if (!EMAIL_PATTERN.test(data.email)) return "Enter a valid email address.";
  if (data.message.length < 20 || data.message.length > 2000) return "Enter a message of at least 20 characters.";
  return "";
}

async function loadEnquiries() {
  tableError.hidden = true;
  const snapshot = await collection().orderBy("createdAt", "desc").get();
  records = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  render();
}

async function saveEnquiry(event) {
  event.preventDefault();
  dialogError.hidden = true;
  const data = formPayload();
  const error = validatePayload(data);
  if (error) {
    dialogError.textContent = error;
    dialogError.hidden = false;
    return;
  }

  const now = firebase.firestore.Timestamp.now();
  const id = enquiryForm.id.value;
  const current = records.find((item) => item.id === id);
  const payload = {
    name: data.name,
    company: data.company,
    email: data.email,
    message: data.message,
    language: data.language,
    status: data.status,
    notes: data.notes,
    updatedAt: now,
    createdAt: current?.createdAt || now,
  };

  try {
    if (id) {
      await collection().doc(id).set(payload);
    } else {
      await collection().add(payload);
    }
    dialog.close();
    await loadEnquiries();
  } catch (err) {
    console.error(err);
    dialogError.textContent = err.message || "The enquiry could not be saved.";
    dialogError.hidden = false;
  }
}

async function deleteEnquiry(id) {
  if (!window.confirm("Delete this enquiry permanently?")) return;
  tableError.hidden = true;
  try {
    await collection().doc(id).delete();
    await loadEnquiries();
  } catch (err) {
    tableError.textContent = err.message || "The enquiry could not be deleted.";
    tableError.hidden = false;
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.hidden = true;
  try {
    await firebase.auth().signInWithEmailAndPassword(
      loginForm.email.value.trim(),
      loginForm.password.value
    );
  } catch (error) {
    loginError.textContent = error.message || "Sign in failed.";
    loginError.hidden = false;
  }
});

enquiryForm.addEventListener("submit", saveEnquiry);
dialogCancel.addEventListener("click", () => dialog.close());
createBtn.addEventListener("click", () => openDialog(null));
signOutBtn.addEventListener("click", () => firebase.auth().signOut());
statusFilter.addEventListener("change", render);
searchInput.addEventListener("input", render);

firebase.auth().onAuthStateChanged(async (user) => {
  const signedIn = Boolean(user);
  loginPanel.hidden = signedIn;
  dashboard.hidden = !signedIn;
  signOutBtn.hidden = !signedIn;
  if (signedIn) {
    await loadEnquiries();
  } else {
    records = [];
    listEl.innerHTML = "";
    dialog.close();
  }
});

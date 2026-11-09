import {
  auth,
  db,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "./firebase.js";

const loginForm = document.getElementById("adminLoginForm");
const loginPanel = document.getElementById("adminLoginPanel");
const adminPanel = document.getElementById("adminPanel");
const questionsContainer = document.getElementById("questions");
const loginStatus = document.getElementById("adminStatus");
const panelStatus = document.getElementById("adminStatusPanel");
const logoutButton = document.getElementById("adminLogout");

function setStatus(message, error = false) {
  for (const status of [loginStatus, panelStatus]) {
    if (!status) continue;
    status.textContent = message;
    status.classList.toggle("is-error", error);
  }
}

function makeButton(label, className, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

function formatDate(value) {
  if (!value || typeof value.toDate !== "function") return "";
  return value.toDate().toLocaleString("fa-IR");
}

async function loadQuestions() {
  if (!questionsContainer) return;
  questionsContainer.replaceChildren();
  setStatus("در حال دریافت سوال‌ها…");

  const questionsQuery = query(
    collection(db, "faq"),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(questionsQuery);

  if (snapshot.empty) {
    setStatus("سوالی ثبت نشده است.");
    return;
  }

  for (const questionDoc of snapshot.docs) {
    const data = questionDoc.data();
    const card = document.createElement("article");
    card.className = "item";

    const questionTitle = document.createElement("h2");
    questionTitle.textContent = data.question || "(بدون متن)";

    const meta = document.createElement("p");
    meta.className = "meta";
    const date = formatDate(data.createdAt);
    meta.textContent = `نام: ${data.name || "بدون نام"}${date ? ` | ${date}` : ""}`;

    const answer = document.createElement("textarea");
    answer.id = `answer-${questionDoc.id}`;
    answer.placeholder = "پاسخ را بنویسید…";
    answer.value = data.answer || "";
    answer.setAttribute("aria-label", "پاسخ سوال");

    const actions = document.createElement("div");
    actions.className = "actions";

    const approveButton = makeButton(
      data.approved ? "تایید شده" : "تایید سوال",
      "approve",
      async () => {
        try {
          await updateDoc(doc(db, "faq", questionDoc.id), { approved: true });
          setStatus("سوال تایید شد.");
          await loadQuestions();
        } catch (error) {
          console.error("Could not approve question:", error);
          setStatus("اجازهٔ تغییر این سوال را ندارید یا اتصال برقرار نیست.", true);
        }
      }
    );

    const saveButton = makeButton("ثبت پاسخ", "answer-button", async () => {
      try {
        await updateDoc(doc(db, "faq", questionDoc.id), {
          answer: answer.value,
          answeredAt: serverTimestamp()
        });
        setStatus("پاسخ ثبت شد.");
      } catch (error) {
        console.error("Could not save answer:", error);
        setStatus("اجازهٔ ثبت پاسخ را ندارید یا اتصال برقرار نیست.", true);
      }
    });

    const deleteButton = makeButton("حذف", "delete", async () => {
      if (!window.confirm("این سوال حذف شود؟")) return;
      try {
        await deleteDoc(doc(db, "faq", questionDoc.id));
        setStatus("سوال حذف شد.");
        await loadQuestions();
      } catch (error) {
        console.error("Could not delete question:", error);
        setStatus("اجازهٔ حذف این سوال را ندارید یا اتصال برقرار نیست.", true);
      }
    });

    actions.append(approveButton, saveButton, deleteButton);
    card.append(questionTitle, meta, answer, actions);
    questionsContainer.append(card);
  }

  setStatus(`تعداد سوال‌ها: ${snapshot.size}`);
}

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("adminEmail")?.value.trim();
  const password = document.getElementById("adminPassword")?.value;
  const submitButton = loginForm.querySelector('button[type="submit"]');

  if (submitButton) submitButton.disabled = true;
  setStatus("در حال ورود…");

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Admin sign-in failed:", error);
    setStatus("ورود انجام نشد. ایمیل، رمز و فعال بودن ورود ایمیلی Firebase را بررسی کنید.", true);
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

logoutButton?.addEventListener("click", async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign-out failed:", error);
    setStatus("خروج انجام نشد. دوباره تلاش کنید.", true);
  }
});

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    if (loginPanel) loginPanel.hidden = false;
    if (adminPanel) adminPanel.hidden = true;
    setStatus("برای ورود، حساب مدیر را وارد کنید.");
    return;
  }

  if (loginPanel) loginPanel.hidden = true;
  if (adminPanel) adminPanel.hidden = false;

  try {
    await loadQuestions();
  } catch (error) {
    console.error("Could not load questions:", error);
    setStatus("دسترسی مدیر در قوانین Firestore تایید نشد یا اتصال Firebase برقرار نیست.", true);
  }
});

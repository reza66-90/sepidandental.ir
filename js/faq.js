document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("faqForm");
  const status = document.getElementById("faqStatus");

  if (!form) return;

  const submitButton = form.querySelector('button[type="submit"]');
  const showStatus = (message, error = false) => {
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", error);
  };

  let firebase;
  try {
    firebase = await import("./firebase.js");
  } catch (error) {
    console.error("Firebase could not be loaded:", error);
    if (submitButton) submitButton.disabled = true;
    showStatus("ارسال آنلاین فعلاً در دسترس نیست. لطفاً با کلینیک تماس بگیرید.", true);
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("faqName");
    const questionInput = document.getElementById("faqQuestion");
    const name = nameInput?.value.trim() || "بدون نام";
    const question = questionInput?.value.trim() || "";

    if (!question) {
      showStatus("لطفاً سوال را وارد کنید.", true);
      questionInput?.focus();
      return;
    }

    if (question.length > 1000 || name.length > 80) {
      showStatus("طول نام یا سوال بیش از حد مجاز است.", true);
      return;
    }

    if (submitButton) submitButton.disabled = true;
    showStatus("در حال ارسال…");

    try {
      await firebase.addDoc(firebase.collection(firebase.db, "faq"), {
        name,
        question,
        answer: "",
        approved: false,
        createdAt: firebase.serverTimestamp()
      });

      form.reset();
      showStatus("سوال شما با موفقیت ثبت شد.");
    } catch (error) {
      console.error("Firebase error:", error);
      showStatus("ارسال انجام نشد. لطفاً بعداً دوباره تلاش کنید یا با کلینیک تماس بگیرید.", true);
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
});

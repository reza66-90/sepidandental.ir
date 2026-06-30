import { db, collection, addDoc, serverTimestamp } from "./firebase.js";

document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("faqForm");

  if (!form) {
    console.error("FAQ form not found!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("faqName").value || "بدون نام";
    const question = document.getElementById("faqQuestion").value;

    if (!question.trim()) {
      alert("سوال را وارد کنید");
      return;
    }

    try {
      await addDoc(collection(db, "faq"), {
        name,
        question,
        answer: "",
        approved: false,
        createdAt: serverTimestamp()
      });

      alert("سوال شما با موفقیت ثبت شد ✅");
      form.reset();

    } catch (error) {
      console.error("Firebase Error:", error);
      alert("خطا در ارسال سوال ❌");
    }
  });

});

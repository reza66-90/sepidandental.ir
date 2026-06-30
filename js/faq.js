import {
db,
collection,
addDoc,
getDocs,
query,
orderBy,
serverTimestamp
} from "./firebase.js";

const form = document.getElementById("faqForm");
const list = document.getElementById("faqList");

async function loadQuestions() {

if(!list) return;

list.innerHTML = "در حال دریافت سوالات...";

const q = query(
collection(db,"faq"),
orderBy("createdAt","desc")
);

const snapshot = await getDocs(q);

list.innerHTML = "";

snapshot.forEach(docItem=>{

const data = docItem.data();

if(data.approved!==true) return;

const item=document.createElement("div");

item.className="faq-item";

item.innerHTML=`

<div class="faq-question">
${data.question}
</div>

<div class="faq-meta">
👤 ${data.name || "کاربر"} |
🕒 ${
data.createdAt?.toDate().toLocaleString("fa-IR") || ""
}
</div>

${
data.answer
?

`
<div class="faq-answer">
<b>پاسخ کلینیک سپیدان</b>

<p>${data.answer}</p>

<div class="faq-meta">
🕒 ${
data.answeredAt?.toDate().toLocaleString("fa-IR") || ""
}
</div>

</div>

`

:""

}

`;

list.appendChild(item);

});

}

if(form){

form.addEventListener("submit",async(e)=>{

e.preventDefault();

const name=document.getElementById("faqName").value;

const question=document.getElementById("faqQuestion").value;

if(question.trim()=="") return;

await addDoc(collection(db,"faq"),{

name,

question,

approved:false,

answer:"",

createdAt:serverTimestamp()

});

alert("سوال شما ثبت شد و پس از تایید نمایش داده می‌شود.");

form.reset();

});

}

loadQuestions();
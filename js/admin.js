import {
db,
collection,
getDocs,
updateDoc,
deleteDoc,
doc,
query,
orderBy,
serverTimestamp
} from "./firebase.js";
const container = document.getElementById("questions");
console.log(container);
const container = document.getElementById("questions");
console.log("admin.js loaded");

async function loadQuestions() {

const q = query(
collection(db,"faq"),
orderBy("createdAt","desc")
);

const snapshot = await getDocs(q);
console.log(snapshot.size);
container.innerHTML = "";

snapshot.forEach(item=>{

const data = item.data();

const div = document.createElement("div");

div.className = "item";

div.innerHTML = `

<h3>${data.question}</h3>

<div class="meta">

👤 ${data.name || "بدون نام"}

<br>

🕒 ${
data.createdAt?.toDate().toLocaleString("fa-IR") || ""
}

</div>

<textarea id="a${item.id}" placeholder="پاسخ خود را بنویسید...">${data.answer || ""}</textarea>

<div class="actions">

<button class="approve">
${data.approved ? "تایید شده" : "تایید سوال"}
</button>

<button class="answer">
ثبت پاسخ
</button>

<button class="delete">
حذف
</button>

</div>

`;

const approveBtn = div.querySelector(".approve");
const answerBtn = div.querySelector(".answer");
const deleteBtn = div.querySelector(".delete");

approveBtn.onclick = async()=>{

await updateDoc(doc(db,"faq",item.id),{

approved:true

});

loadQuestions();
console.log("Docs:", snapshot.size);
};

answerBtn.onclick = async()=>{

const answer =
document.getElementById("a"+item.id).value;

await updateDoc(doc(db,"faq",item.id),{

answer,

answeredAt:serverTimestamp()

});

alert("پاسخ ثبت شد.");

};

deleteBtn.onclick = async()=>{

if(confirm("این سوال حذف شود؟")){

await deleteDoc(doc(db,"faq",item.id));

loadQuestions();

}

};

container.appendChild(div);

});

}

loadQuestions();

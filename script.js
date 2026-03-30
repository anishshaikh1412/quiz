// Array of object for question - answers
const questions = [
    {
        que: "What does HTML stand for?",
        ans: "Hyper Text Markup Language",
        opt: [
            "Hyper Trainer Marking Language",
            "Hyper Text Markup Language",
            "Hyper Text Marketing Language",
            "Hyper Tool Multi Language",
        ],
    },
    {
        que: "Which tag is used to create a hyperlink?",
        ans: "a",
        opt: ["link", "a", "href", "hyper"],
    },
    {
        que: "Which keyword is used to declare a variable?",
        ans: "All of the above",
        opt: ["var", "let", "const", "All of the above"],
    },
    {
        que: "Which method is used to print in console?",
        ans: "console.log()",
        opt: ["print()", "console.log()", "log.console()", "write()"],
    },
    {
        que: "Which operator is used for strict equality?",
        ans: "===",
        opt: ["==", "=", "===", "!="],
    },
];
// Print number of question in webpage
let totalQues = document.querySelector("#totalque");
totalQues.innerText = questions.length.toString();
// Set anssheet to display none at the strat of quiz
let anssheet = document.querySelector(".ans-con");
anssheet.style.display = "none";
// variable for traversing array of questions
let currIdx = 0;
// Set prev button
let prev = document.querySelector("#prev");
prev.innerText = "Prev";
// Set next button
let next = document.querySelector("#next");
next.innerText = "Next";
// Function for load question
function loadQuestion() {
    // set prev button to disable for first question
    if (currIdx === 0) {
        prev.disabled = true;
    }
    else {
        prev.disabled = false;
    }
    // set next button to submit for last question
    if (currIdx === questions.length - 1) {
        next.innerText = "Submit";
        next.style.backgroundColor = "#28a745";
    }
    else {
        next.innerText = "Next";
        next.style.backgroundColor = "#0276d7";
    }
    // Write question in webpage
    let que = document.querySelector(".que");
    que.innerHTML = `<span id="queno">${currIdx + 1}.</span> ${questions[currIdx].que}`;
    // Write options in webpage
    let options = document.querySelectorAll(".opt");
    let optArr = questions[currIdx].opt;
    options.forEach((val, idx) => {
        val.innerText = optArr[idx];
    });
    let radios = document.querySelectorAll(".radio");
    radios.forEach((val, idx) => {
        // Set radio button value
        val.value = optArr[idx];
        // Weather ans is selected before radio button will be checked
        val.checked = val.value == userAns[currIdx] ? true : false;
    });
}
prev.addEventListener("click", () => {
    // Prev button should be clicked if it's not first question
    if (currIdx > 0) {
        currIdx--;
        loadQuestion();
    }
});
// Array for user answers with empty string
let userAns = new Array(questions.length).fill("");
next.addEventListener("click", () => {
    let radios = document.querySelectorAll(".radio");
    // Store user's ans in array
    radios.forEach((val) => {
        if (val.checked) {
            userAns[currIdx] = val.value;
        }
    });
    // Set next button until it's not last question
    if (currIdx < questions.length - 1) {
        currIdx++;
        loadQuestion();
        return;
    }
    // Calculte result if user submit last question
    if (currIdx == questions.length - 1) {
        calculateResult();
    }
});
// Function for calculateResult
function calculateResult() {
    // Set score initially 0
    let score = 0;
    // Check ans whether it's correct
    userAns.forEach((val, idx) => {
        if (val === questions[idx].ans) {
            score++;
        }
    });
    // Access quetion/options container
    let container = document.querySelector(".que-container");
    // Add a class so that score looks in middle of container
    container.classList.add("score-con");
    // Display score
    container.innerHTML = ` <div style="display:flex; flex-direction:column; align-items:center; gap:14px;">
            <h1 class="score">Your score is ${score}/${questions.length}</h1>
            <a id="answersheet" style="cursor:pointer;">Answersheet</a>
        </div>`;
    // Acced answersheet link
    let anslink = document.querySelector("#answersheet");
    // After click on link of anssheet showAnssheet() function will be called
    anslink.addEventListener("click", showAnssheet);
}
// Function to display answersheet
function showAnssheet() {
    let ansCon = document.querySelector(".ans-con");
    let anssheet = document.querySelector(".anssheet");
    // Close button in answersheet
    anssheet.innerHTML = `<span id="close"><i class="fa-solid fa-xmark"></i></span>`;
    // Write question answer with correct and user's answers in answersheet
    questions.forEach((val, idx) => {
        anssheet.innerHTML += `<div style="margin-bottom:20px; border-bottom:1px solid #ddd; padding-bottom:12px;">
      <p class="que">${idx + 1} ${val.que}</p>
      <div class="options">
        <p>A. ${val.opt[0]}</p>
        <p>B. ${val.opt[1]}</p>
        <p>C. ${val.opt[2]}</p>
        <p>D. ${val.opt[3]}</p>
      </div>
      <p id="corrans">Correct Answer: <span>${val.ans}</span></p>
      <p id="userans">Your Answer: <span>${userAns[idx] === "" ? "No answer" : userAns[idx]}</span></p>
      <p id="status">${val.ans === userAns[idx] ? "Correct ✔️" : "Wrong ❌"}</p>
    </div>`;
    });
    let closeBtn = document.querySelector("#close");
    // Answersheet close logic
    closeBtn.addEventListener("click", () => {
        ansCon.style.display = "none";
    });
    ansCon.style.display = "flex";
}
// For initially display first question
loadQuestion();
// Set timer, 10 seconds for each question
let totalSec = questions.length * 10;
setInterval(() => {
    if (totalSec === 0) {
        calculateResult();
        return;
    }
    totalSec--;
    let hour = Math.floor(totalSec / 60 / 60);
    let min = Math.floor(totalSec / 60);
    let sec = totalSec % 60;
    let timecon = document.querySelector("#time");
    let time = new Date(0, 0, 0, hour, min, sec).toLocaleTimeString("en-GB", {
        hour12: false,
    });
    timecon.innerText = time;
}, 1000);

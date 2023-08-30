import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
var programmerQuotes = false;
var answer = "";
var riddle = "";


app.use(express.urlencoded({ extented: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    if (programmerQuotes) {
        getProgrammerQuote(res);
    } else {
        getGardenQuote(res);
    }
    
});

async function getProgrammerQuote(res) {
    const response = await axios.get("https://programming-quotesapi.vercel.app/api/random");
    res.render("quotesPage.ejs", { 
        quote: response.data.quote,
        author: response.data.author,
        checked: "checked"
    });
}

async function getGardenQuote(res) {
    const response = await axios.get("https://quote-garden.onrender.com/api/v3/quotes/random");
    const quoteData = response.data.data;
    res.render("quotesPage.ejs", { 
        quote: quoteData[0].quoteText,
        author: quoteData[0].quoteAuthor,
        checked: ""
    });
}

app.post("/generate", (req, res) => {
    isProgrammerQuotesOn(req.body)
    res.redirect("/");
});

function isProgrammerQuotesOn(check) {
    
    if (check.programmerCheckbox == 'on') {
        programmerQuotes = true;
        return;
    }
    programmerQuotes = false;
}

app.get("/advices", async (req, res) => {
    const response = await axios.get("https://api.adviceslip.com/advice");
    const adviceData = response.data;
    res.render("advicesPage.ejs", {
        advice: adviceData.slip.advice
    })
});

app.get("/memes", async (req, res) => {
    const response = await axios.get("https://meme-api.com/gimme");
    res.render("memesPage.ejs", {
        memeUrl: response.data.url
    })
});

app.get("/riddles", async (req, res) => {
    const response = await axios.get("https://riddles-api.vercel.app/random");
    console.log(response.data);
    riddle = response.data.riddle
    answer = response.data.answer;
    res.render("riddlesPage.ejs", {
        riddle: riddle
    });
});

app.post("/answer", (req, res) => {
    console.log(req.body);
    const message = validateAnswer(req.body.userAnswer)
    res.render("riddlesPage.ejs", {
        riddle: riddle,
        message: message
    })
});

function validateAnswer(userAnswer) {
    if (answer == userAnswer) {
        return "Correct!"
    }
    return "Wrong!"
}

app.listen(port, () => {
    console.log(`Server is runnning on port: ${port}.`);
});


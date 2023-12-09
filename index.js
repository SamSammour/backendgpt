import express  from "express";
import OpenAI from 'openai';
import { config } from "dotenv";

config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY 
});

console.log(process.env.OPENAI_API_KEY )

const app = express();
const port = 3001;


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

async function gptResponse(gptQuery,res ) {
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-4-1106-preview",
    messages: [{"role": "user", "content": gptQuery } ],
  });
  console.log(chatCompletion.choices[0].message);
  const GptPrompt = JSON.stringify(chatCompletion.choices[0].message.content);
  console.log("Prompt", GptPrompt);
  res.send({summary : GptPrompt});
}
app.post("/", (req, res) => {
  const message = req?.body?.message;
  let language  = "english"
  console.log(message.split(" ")[0])
  if (/^[a-zA-Z]+$/.test(message.split(" ")[0])) //if the English language 
  {
      language = "arabic"
  } 
 

  const gptQuery = `
     1. Give the response in : ${language} language.
     2. remove " \ \ "from the response and return in <p> </p> tags.
     3. don't add  these characters in the response ("/","\", \n,\n, ",\n\n)

     follow the above rules to  Summarize the following data : "${message}" in 800 words.
  `;
  console.log({gptQuery})
  gptResponse(gptQuery, res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import express  from "express";
import OpenAI from 'openai';
import { config } from "dotenv";

config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // This is also the default, can be omitted
});

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
  console.log({message})
  const gptQuery = `
     1. Summarize the following data : "${message}" in no more than 500 words.
     2. If the data is in english language give the response only in arabic language & don't give the response in english else give the response in english language.
     3. remove \ \ from the response and return in <p> </p> tags.
     4. don't add  these characters in the response ("/","\", \n,\n, ",")
  `;
  gptResponse(gptQuery, res);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

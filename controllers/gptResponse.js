const openai = require("openai");
const translate = require("@vitalets/google-translate-api");

function getFinalHeading(headings) {
  let message = "";
  for (const key in headings) {
    if (!!headings[key].length) {
      message = headings[key].toString();
      break;
    }
  }
  return message;
}

function splitText(text, maxChar) {
  let parts = [];
  while (text?.length > 0) {
    let splitAt = text.lastIndexOf(" ", maxChar);
    if (splitAt === -1) splitAt = maxChar;
    parts.push(text.substring(0, splitAt).trim());
    text = text.substring(splitAt).trim();
  }
  return parts[0];
}

function returnGPTquery(req, type) {
  const message = req?.body?.message || "";
  const headings = req?.body?.headings || "";
  const finalHeadings = getFinalHeading(headings);

  let query = "";
  let tokens = 300;

  switch (type) {
    case "summarize":
      const maxCharPerPart = 10000;
      const textParts = splitText(message, maxCharPerPart);
      query =
        "Summarize the following text: " +
        textParts +
        " and heading(s) for the text is/are" +
        finalHeadings;
      break;

    case "context":
      query =
        "Please provide context for the following statement in a single, well-structured paragraph:" +
        message +
        " and heading(s) for the text is/are" +
        finalHeadings;
      tokens = 500;
      break;

    case "counterArguments":
      (query =
        "Please provide counter-arguments for the following statement in a single, well-structured paragraph: " +
        message +
        " and headings for the text is" +
        finalHeadings),
        (tokens = 500);
      break;

    default:
      break;
  }

  return { query, tokens };
}

async function getGptResponse(req, type) {
  const openaiInit = new openai.OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const { query, tokens } = returnGPTquery(req, type);

  const response = await openaiInit.chat.completions.create({
    model: "gpt-3.5-turbo-16k",
    messages: [
      {
        role: "user",
        content: query,
      },
    ],
    max_tokens: tokens,
    temperature: 0.0,
  });
  const gptResponse = response.choices[0].message.content;
  const translatedResponse = await translate.translate(`${gptResponse}`, {
    from: "en",
    to: "ar",
  });
  const responseToReturn = translatedResponse?.text || "";

  return responseToReturn;
}

module.exports = {
  getGptResponse,
};

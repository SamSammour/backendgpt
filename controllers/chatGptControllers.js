const gptResponse = require("./gptResponse");

async function summarizeText(req, res) {
  try {
    const type = req?.body?.type || "";

    if (!type?.length) {
      res.status(400).send("type is missing.");
      return;
    }

    const isProperTypefound = ["summarize", "context", "counterArguments"].some(
      (val) => val === type
    );

    if (!isProperTypefound) {
      res.status(400).send("Type of sumarization is invalid.");
      return;
    }

    const resposeText = await gptResponse.getGptResponse(req, type);

    res.send({ summary: resposeText });
  } catch (error) {
    res.status(500).send(error.message);
  }
}

module.exports = {
  summarizeText,
};

const express = require('express');
const router = express.Router();
const gptController = require("../controllers/chatGptControllers")


router.get('/', (req, res) => {
  res.send('API home');
});


router.post('/summarize',gptController.summarizeText)

module.exports = router;
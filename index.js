const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const app = express();
app.use(express.json());

// 直接发送当前目录下的 index.html
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

app.post('/generate', async (req, res) => {
    const { apiKey, keyword, title, bullets } = req.body;
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `关键词"${keyword}"，标题"${title}"，五点"${bullets}"，重构Listing。严禁使用&和perfect。`;
    try {
        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (e) { res.status(500).json({ error: e.message }); }
});
app.listen(process.env.PORT || 3000);

const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const app = express();
app.use(express.json());

// 设置网页入口
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

// 设置中转接口
app.post('/generate', async (req, res) => {
    const { apiKey, keyword, title, bullets } = req.body;
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
       const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `分析关键词"${keyword}"，标题"${title}"，五点"${bullets}"，重构为亚马逊 Listing。严禁使用 "&" 和 "perfect"。请输出地道、高转化的亚马逊中东站英文文案。`;
        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(process.env.PORT || 3000);

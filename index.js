const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');
const app = express();
app.use(express.json());

app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'index.html')); });

app.post('/generate', async (req, res) => {
    const { apiKey, keyword, title, bullets } = req.body;
    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // 不再写死模型名称，而是使用最通用的 getGenerativeModel
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `关键词"${keyword}"，标题"${title}"，五点"${bullets}"，重构Listing。严禁使用&和perfect。`;
        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (e) { 
        // 增加一个调试反馈
        res.status(500).json({ error: "服务器通讯正常，但 API 拒绝了请求。请确保你的 API Key 拥有 Gemini 1.5 的访问权限。" }); 
    }
});
app.listen(process.env.PORT || 3000);

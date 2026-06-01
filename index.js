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
        // 使用 gemini-pro 模型，如果还报错，请改为 gemini-1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = `分析关键词"${keyword}"，标题"${title}"，五点"${bullets}"，重构Listing。严禁使用&和perfect。`;
        const result = await model.generateContent(prompt);
        res.json({ text: result.response.text() });
    } catch (e) { 
        res.status(500).json({ error: "API调用失败，请检查密钥权限或稍后再试: " + e.message }); 
    }
});

app.listen(process.env.PORT || 3000);

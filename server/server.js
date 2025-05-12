const express = require('express');
const cors = require('cors');
const analyzeRoute = require('./routes/analyzeRoute');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', analyzeRoute);

app.listen(PORT, () => {
  console.log(`경쟁사 분석 서버가 포트 ${PORT}에서 실행 중입니다`);
});

module.exports = app;

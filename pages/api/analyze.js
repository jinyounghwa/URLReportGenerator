import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: '허용되지 않는 메소드입니다' });
  }

  try {
    const { url, options } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL이 필요합니다' });
    }
    
    // 내부 서버 API 호출
    const serverUrl = process.env.SERVER_URL || 'http://localhost:3001';
    const response = await axios.post(`${serverUrl}/api/analyze`, {
      url,
      options
    });
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('API 오류:', error);
    
    // 서버 응답 오류 처리
    if (error.response) {
      return res.status(error.response.status).json({
        message: '분석 서버 오류',
        error: error.response.data
      });
    }
    
    // 네트워크 오류 처리
    res.status(500).json({
      message: '분석 중 오류가 발생했습니다',
      error: error.message
    });
  }
}

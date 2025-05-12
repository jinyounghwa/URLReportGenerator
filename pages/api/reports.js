import axios from 'axios';

export default async function handler(req, res) {
  const { method } = req;
  const serverUrl = process.env.SERVER_URL || 'http://localhost:3001';

  try {
    if (method === 'GET') {
      // 리포트 목록 조회
      const response = await axios.get(`${serverUrl}/api/reports`);
      return res.status(200).json(response.data);
    }
    
    return res.status(405).json({ message: '허용되지 않는 메소드입니다' });
  } catch (error) {
    console.error('API 오류:', error);
    
    // 서버 응답 오류 처리
    if (error.response) {
      return res.status(error.response.status).json({
        message: '서버 오류',
        error: error.response.data
      });
    }
    
    // 네트워크 오류 처리
    res.status(500).json({
      message: '요청 처리 중 오류가 발생했습니다',
      error: error.message
    });
  }
}

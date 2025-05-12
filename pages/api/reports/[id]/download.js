import axios from 'axios';

export default async function handler(req, res) {
  const { id } = req.query;
  const serverUrl = process.env.SERVER_URL || 'http://localhost:3001';

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ message: '허용되지 않는 메소드입니다' });
    }
    
    // 리포트 다운로드 요청
    const response = await axios.get(`${serverUrl}/api/reports/${id}/download`, {
      responseType: 'arraybuffer'
    });
    
    // 응답 헤더 설정
    const contentType = response.headers['content-type'] || 'application/json';
    const contentDisposition = response.headers['content-disposition'] || `attachment; filename="report-${id}.pdf"`;
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', contentDisposition);
    
    // 파일 데이터 전송
    res.status(200).send(response.data);
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

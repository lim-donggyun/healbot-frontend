# 네이버 클로버 OCR API 통합 가이드

## 프론트엔드 구현 완료 ✅
- 관리자 사이드바에 "OCR 영수증 인식" 메뉴 추가
- 카메라 촬영 및 파일 업로드 기능
- 추출된 텍스트 표시 및 복사 기능

## 백엔드 구현 필요 사항

### 1. 네이버 클로버 OCR API 설정

먼저 네이버 클라우드 플랫폼에서 OCR API 키를 발급받아야 합니다:
1. https://www.ncloud.com/ 접속
2. AI·NAVER API > AI Service > CLOVA OCR 선택
3. General OCR (일반 문자 인식) 또는 Template OCR 선택
4. API Key와 Secret Key 발급

### 2. 백엔드 API 엔드포인트 구현 예시 (Node.js/Express)

```javascript
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const router = express.Router();

// 파일 업로드 설정
const upload = multer({ storage: multer.memoryStorage() });

// 네이버 OCR API 설정
const OCR_API_URL = 'https://[YOUR-CLOVA-OCR-DOMAIN]/api/v1/ocr';
const OCR_SECRET_KEY = process.env.NAVER_OCR_SECRET_KEY;

// OCR 영수증 인식 엔드포인트
router.post('/api/ocr/receipt', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
    }

    // OCR API 요청 메시지 구성
    const message = {
      version: 'V2',
      requestId: Date.now().toString(),
      timestamp: Date.now(),
      images: [
        {
          format: req.file.mimetype.split('/')[1],
          name: req.file.originalname,
        }
      ]
    };

    // FormData 구성
    const formData = new FormData();
    formData.append('message', JSON.stringify(message));
    formData.append('file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    // 네이버 OCR API 호출
    const response = await axios.post(OCR_API_URL, formData, {
      headers: {
        'X-OCR-SECRET': OCR_SECRET_KEY,
        ...formData.getHeaders(),
      },
    });

    // 결과 반환
    res.json(response.data);

  } catch (error) {
    console.error('OCR API Error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'OCR 처리 중 오류가 발생했습니다.',
      details: error.response?.data || error.message,
    });
  }
});

module.exports = router;
```

### 3. Spring Boot 백엔드 예시

```java
@RestController
@RequestMapping("/api/ocr")
public class OcrController {

    @Value("${naver.ocr.api.url}")
    private String ocrApiUrl;

    @Value("${naver.ocr.secret.key}")
    private String secretKey;

    @PostMapping("/receipt")
    public ResponseEntity<?> processReceipt(@RequestParam("image") MultipartFile image) {
        try {
            // 요청 메시지 구성
            Map<String, Object> message = new HashMap<>();
            message.put("version", "V2");
            message.put("requestId", String.valueOf(System.currentTimeMillis()));
            message.put("timestamp", System.currentTimeMillis());

            List<Map<String, String>> images = new ArrayList<>();
            Map<String, String> imageInfo = new HashMap<>();
            imageInfo.put("format", getFileExtension(image.getOriginalFilename()));
            imageInfo.put("name", image.getOriginalFilename());
            images.add(imageInfo);
            message.put("images", images);

            // Multipart 요청 구성
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA);
            headers.set("X-OCR-SECRET", secretKey);

            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("message", new ObjectMapper().writeValueAsString(message));
            body.add("file", new ByteArrayResource(image.getBytes()) {
                @Override
                public String getFilename() {
                    return image.getOriginalFilename();
                }
            });

            HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);

            // OCR API 호출
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(
                ocrApiUrl,
                HttpMethod.POST,
                requestEntity,
                String.class
            );

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "OCR 처리 중 오류가 발생했습니다.",
                            "details", e.getMessage()));
        }
    }

    private String getFileExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }
}
```

### 4. 환경 변수 설정

`.env` 파일 또는 `application.properties`에 추가:

```
# Node.js
NAVER_OCR_API_URL=https://[YOUR-CLOVA-OCR-DOMAIN]/api/v1/ocr
NAVER_OCR_SECRET_KEY=your_secret_key_here

# Spring Boot
naver.ocr.api.url=https://[YOUR-CLOVA-OCR-DOMAIN]/api/v1/ocr
naver.ocr.secret.key=your_secret_key_here
```

### 5. CORS 설정 (개발 환경)

백엔드에서 프론트엔드 요청을 허용하도록 CORS 설정 필요:

```javascript
// Express
app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 주소
  credentials: true
}));
```

```java
// Spring Boot
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("*");
    }
}
```

### 6. 프론트엔드 프록시 설정 (개발 환경)

`package.json`에 프록시 추가 (백엔드가 다른 포트에서 실행되는 경우):

```json
{
  "proxy": "http://localhost:8080"
}
```

또는 `vite.config.js`/`webpack.config.js`에서 프록시 설정

## API 응답 형식

네이버 클로버 OCR API의 응답 형식:

```json
{
  "version": "V2",
  "requestId": "1234567890",
  "timestamp": 1234567890,
  "images": [
    {
      "uid": "image_uid",
      "name": "receipt.jpg",
      "inferResult": "SUCCESS",
      "message": "Success",
      "fields": [
        {
          "valueType": "ALL",
          "boundingPoly": {
            "vertices": [...]
          },
          "inferText": "추출된 텍스트",
          "inferConfidence": 0.9985
        }
      ]
    }
  ]
}
```

## 테스트 방법

1. 백엔드 API 구현 후 서버 실행
2. 관리자 페이지에서 `/admin/ocr` 접속
3. 영수증 이미지 업로드 또는 카메라로 촬영
4. "텍스트 추출" 버튼 클릭
5. 추출된 텍스트 확인

## 주의사항

⚠️ **보안**
- API 키는 반드시 환경 변수로 관리
- .env 파일은 .gitignore에 추가
- 프론트엔드에서 직접 OCR API 호출 금지 (CORS 및 키 노출 문제)

⚠️ **비용**
- 네이버 클로버 OCR은 유료 서비스
- 무료 크레딧 이후 사용량에 따라 과금
- 테스트 시 요청 수 제한 권장

## 실험 종료 시 되돌리기

이 기능을 제거하려면:
1. `Sidebar.jsx`에서 OCR 메뉴 항목 제거
2. `App.jsx`에서 `/admin/ocr` 라우트 제거
3. `AdminPage.jsx`에서 OCR import 및 조건 제거
4. `OCR.jsx`, `OCR.css` 파일 삭제
5. 백엔드 API 엔드포인트 제거

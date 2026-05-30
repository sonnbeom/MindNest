# Troubleshooting: Spring Boot → FastAPI 422 Unprocessable Entity

**날짜**: 2026-05-30  
**환경**: Spring Boot 4 (Java 17) → FastAPI (uvicorn) RAG 서버  
**증상**: `POST /rag/analyze` 호출 시 422 Unprocessable Entity

---

## 증상

Spring Boot에서 FastAPI RAG 서버로 요청 시 422 응답.

```
ResourceAccessException: I/O error on POST request for "http://localhost:8000/rag/analyze": null
→ RAG 서버 analyze 호출 실패 [HTTP 422 UNPROCESSABLE_CONTENT]
```

FastAPI 서버 로그:

```
WARNING:  Unsupported upgrade request.
INFO:     127.0.0.1:44756 - "POST /rag/analyze HTTP/1.1" 422 Unprocessable Entity
WARNING:  Invalid HTTP request received.
```

---

## 디버깅 과정

### 1단계 — RAG 서버 자체 검증

curl로 RAG 서버를 직접 호출하면 정상 200 응답.

```bash
curl -X POST http://localhost:8000/rag/analyze \
  -H "Content-Type: application/json" \
  -d '{"intake_text": "오늘 회의에서 발표를 망쳤다"}'
# → 200 OK
```

→ RAG 서버 자체는 정상. Spring Boot → RAG 구간 문제.

### 2단계 — Content-Type 헤더 누락 의심

`RagConfig`의 `RestClient`에 `Content-Type: application/json` 기본 헤더가 없었음.

```java
// 수정 전
RestClient.builder().baseUrl(ragServerUrl).build();

// 수정 후
RestClient.builder()
    .baseUrl(ragServerUrl)
    .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
    .build();
```

→ 효과 없음. 422 지속.

### 3단계 — Spring Boot 디버그 로그 활성화

`application.yaml`에 추가:

```yaml
logging:
  level:
    org.springframework.web.client: DEBUG
```

로그 확인:

```
Writing [{intake_text=테스트}] as "application/json"
with org.springframework.http.converter.json.JacksonJsonHttpMessageConverter
```

→ Spring Boot는 `application/json`으로 정상 직렬화 중. Content-Type 문제 아님.

### 4단계 — 실제 HTTP 요청 캡처

RAG 서버를 잠깐 내리고 포트 8000에 Python 캡처 서버를 올려 Spring Boot가 보내는 원본 요청을 확인.

```
PATH: /rag/analyze
HEADERS:
  Connection: Upgrade, HTTP2-Settings
  HTTP2-Settings: AAEAAEAAAAIAAAAAAAMAAAAAAAQBAAAAAAUAAEAAAAYABgAA
  Transfer-encoding: chunked
  Upgrade: h2c                         ← HTTP/2 업그레이드 시도
  User-Agent: Java-http-client/17.0.19
  Content-Type: application/json
BODY: b''                              ← 바디가 비어 있음
```

---

## 근본 원인

**Java 17 `HttpClient`의 기본 HTTP/2 업그레이드 동작.**

`RestClient`의 기본 구현이 Java 17 내장 `HttpClient`를 사용하며, 이 클라이언트는 기본적으로 HTTP/2(h2c) 업그레이드를 시도한다.

- `Upgrade: h2c` + `HTTP2-Settings` 헤더 추가
- `Transfer-Encoding: chunked` 사용 → `Content-Length` 헤더 없음

uvicorn은 `Upgrade: h2c` 요청을 지원하지 않아 `Unsupported upgrade request` 경고를 출력하고, chunked body를 제대로 읽지 못해 422를 반환.

---

## 해결책

`RagConfig`에서 `HttpClient`를 `HTTP_1_1` 버전으로 고정.

```java
@Configuration
public class RagConfig {

    @Value("${rag.server.url}")
    private String ragServerUrl;

    @Bean
    public RestClient ragRestClient() {
        HttpClient httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)  // HTTP/2 업그레이드 비활성화
                .build();

        return RestClient.builder()
                .baseUrl(ragServerUrl)
                .requestFactory(new JdkClientHttpRequestFactory(httpClient))
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
```

---

## 교훈

| 항목 | 내용 |
|------|------|
| Java 17 HttpClient 기본값 | HTTP/2 업그레이드를 자동 시도함 |
| uvicorn HTTP/2 지원 | h2c (plaintext HTTP/2) 미지원 |
| 디버그 포인트 | `org.springframework.web.client: DEBUG` 로그로 직렬화는 확인 가능하나 전송 수준 헤더는 캡처 서버로 직접 확인해야 함 |
| WSL2 주의사항 | `/mnt/c` Windows 파일시스템에서 Gradle 증분 빌드가 타임스탬프 문제로 변경사항을 감지 못할 수 있음 → `./gradlew clean bootRun` 필요 |

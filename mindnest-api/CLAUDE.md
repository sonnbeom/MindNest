# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working in the `mindnest-api/` directory.

> 세션 플로우·CBT 도메인·데이터 구조는 루트 [CLAUDE.md](../CLAUDE.md)와 [Product.md](../Product.md) 참조.

---

## ⚠️ 이 Spring Boot는 당신이 아는 Spring Boot가 아닙니다

**Spring Boot 4 / Spring Framework 7** — 훈련 데이터의 Spring Boot 2/3와 다릅니다.
- `javax.*` 패키지 완전 제거 → 반드시 `jakarta.*` 사용
- Spring MVC (`spring-boot-starter-webmvc`) 기반, WebFlux 아님
- Java 17 최소 요구
- `spring-boot-starter-webmvc`는 `RestClient.Builder` 빈을 자동 등록하지 않음  
  → `@Bean` 메서드에서 `RestClient.Builder builder` 파라미터 주입 불가  
  → 반드시 `RestClient.builder().baseUrl(...).build()` 정적 메서드로 직접 생성할 것

---

## Commands

```bash
./gradlew bootRun        # 서버 실행
./gradlew test           # 전체 테스트 실행
./gradlew test --tests "com.mindnest.api.service.SessionServiceTest"  # 단일 테스트 클래스
./gradlew test --tests "*.SessionServiceTest.should_*"                # 단일 테스트 메서드
./gradlew build          # 빌드 (테스트 포함)
./gradlew build -x test  # 테스트 제외 빌드
./gradlew clean          # 빌드 산출물 제거
```

---

## 패키지 구조

```
com.mindnest.api/
├── controller/          # HTTP 진입점 — 요청 수신·응답 반환만
├── service/             # 비즈니스 로직
├── domain/              # 도메인 모델 (Entity, Value Object)
│   ├── session/
│   └── distortion/
├── repository/          # 데이터 접근 (향후 DB 연동 시 추가)
├── dto/
│   ├── request/         # 클라이언트 → 서버 입력 DTO
│   └── response/        # 서버 → 클라이언트 출력 DTO
├── exception/           # 커스텀 예외 + GlobalExceptionHandler
└── config/              # Spring 설정 클래스
```

레이어 간 의존 방향: `controller → service → domain ← repository`
역방향 의존 금지 (domain이 controller를 알아서는 안 됨).

---

## TDD 규칙

**Red → Green → Refactor 순서를 지킵니다. 구현 먼저 작성 금지.**

### 테스트 작성 순서
1. 실패하는 테스트를 먼저 작성
2. 테스트를 통과시키는 최소한의 구현
3. 중복 제거 및 리팩터링 (테스트는 계속 통과해야 함)

### 테스트 네이밍
```java
// 형식: should_기대결과_when_상황
@Test
void should_returnDistortions_when_validIntakeTextGiven() { ... }

// 또는 한글도 허용
@Test
void 유효한_입력_텍스트가_주어지면_인지왜곡_목록을_반환한다() { ... }
```

### 테스트 레이어 분리

| 테스트 종류 | 어노테이션 | 대상 | Spring 컨텍스트 |
|------------|-----------|------|----------------|
| 단위 테스트 | 없음 (순수 Java) | Service, Domain | ❌ 불필요 |
| Controller 테스트 | `@WebMvcTest` | Controller | 슬라이스만 로딩 |
| 통합 테스트 | `@SpringBootTest` | 전체 흐름 | ✅ 전체 로딩 |

```java
// ✅ Service 단위 테스트 — @SpringBootTest 사용 금지
class SessionServiceTest {
    private SessionService sessionService;

    @BeforeEach
    void setUp() {
        sessionService = new SessionService(/* 의존성 직접 주입 */);
    }
}

// ✅ Controller 테스트 — 슬라이스 테스트
@WebMvcTest(SessionController.class)
class SessionControllerTest {
    @Autowired MockMvc mockMvc;
    @MockitoBean SessionService sessionService;  // Spring Boot 4: @MockitoBean
}
```

> `@MockitoBean`은 Spring Boot 4에서 도입된 어노테이션입니다. `@MockBean` (3.x) 사용 금지.

### Given-When-Then 구조 준수
```java
@Test
void should_incrementCbtTurn_when_turnSubmitted() {
    // given
    Session session = Session.of(SessionStage.CBT_DIALOGUE);

    // when
    session.submitTurn("사용자 답변");

    // then
    assertThat(session.getCbtTurn()).isEqualTo(1);
}
```

---

## OOP 원칙

### SRP — 단일 책임 원칙
- **Controller**: HTTP 수신·유효성 검증·응답 반환만. 비즈니스 로직 없음.
- **Service**: 비즈니스 로직만. HTTP 객체(`HttpServletRequest` 등) 사용 금지.
- **Domain**: 상태와 그 상태를 다루는 행동을 함께 소유.

### DIP — 의존성 역전 원칙
Service가 확장 가능성이 있는 구현에 의존할 경우 인터페이스로 추상화합니다.
```java
// ✅ 인터페이스에 의존
public class DistortionAnalysisService {
    private final LlmClient llmClient;  // interface
}

// ❌ 구체 클래스에 직접 의존 (교체가 필요한 경우)
public class DistortionAnalysisService {
    private final OpenAiClient openAiClient;
}
```

### 도메인 모델에 행동을 넣을 것 (Anemic Domain Model 금지)
```java
// ❌ 빈껍데기 도메인 — Service에 모든 로직이 몰림
public class Session {
    private int cbtTurn;
    // getter/setter만 존재
}

// ✅ 도메인이 자신의 상태를 스스로 관리
public class Session {
    private int cbtTurn;

    public void submitTurn(String userMessage) {
        validateTurnInProgress();
        this.chatHistory.add(ChatMessage.ofUser(userMessage));
        this.cbtTurn++;
    }

    private void validateTurnInProgress() {
        if (this.stage != SessionStage.CBT_DIALOGUE) {
            throw new InvalidSessionStateException(this.stage);
        }
    }
}
```

---

## 의존성 주입

**생성자 주입만 사용합니다.** 필드 주입(`@Autowired` on field) 금지.

```java
// ❌ 필드 주입 — 테스트 어렵고, 순환 의존성 런타임까지 숨겨짐
@Service
public class SessionService {
    @Autowired
    private DistortionRepository repository;
}

// ✅ 생성자 주입 — Lombok @RequiredArgsConstructor 활용
@Service
@RequiredArgsConstructor
public class SessionService {
    private final DistortionRepository repository;
}
```

---

## Lombok 사용 규칙

```java
// ✅ DTO (불변 입력값)
@Getter
@Builder
public class AnalysisRequest {
    private final String intakeText;
    private final int intakeSud;
}

// ✅ 또는 Java record 사용 (Java 16+, 불변 DTO에 적합)
public record AnalysisRequest(String intakeText, int intakeSud) {}

// ✅ 도메인 모델
@Getter
@RequiredArgsConstructor
public class Session { ... }

// ❌ 도메인/엔티티에 @Data 금지
// @Data는 @ToString + @EqualsAndHashCode + @Setter 포함 → 양방향 관계 시 무한루프, 불변성 파괴
@Data
public class Session { ... }

// ❌ @Setter 금지 — 도메인 상태는 의미있는 메서드로만 변경
```

---

## 예외 처리

**커스텀 예외를 도메인별로 정의하고, 전역 핸들러에서 일괄 처리합니다.**

```java
// exception/ 패키지에 정의
public class InvalidSessionStateException extends RuntimeException {
    public InvalidSessionStateException(SessionStage current) {
        super("Invalid stage: " + current);
    }
}

// GlobalExceptionHandler
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(InvalidSessionStateException.class)
    public ResponseEntity<ErrorResponse> handle(InvalidSessionStateException e) {
        return ResponseEntity.badRequest().body(ErrorResponse.of(e.getMessage()));
    }
}
```

- `catch` 블록에서 예외를 무시(빈 블록)하는 코드 금지
- 체크 예외를 무분별하게 `throws`로 전파 금지 — 복구 불가능하면 언체크 예외로 전환

---

## API 응답 형식

모든 응답은 일관된 구조를 사용합니다.

```java
// 성공
public record ApiResponse<T>(T data) {
    public static <T> ApiResponse<T> of(T data) { return new ApiResponse<>(data); }
}

// 실패
public record ErrorResponse(String message) {
    public static ErrorResponse of(String message) { return new ErrorResponse(message); }
}
```

HTTP 상태코드 기준:
- `200 OK` — 조회
- `201 Created` — 생성
- `400 Bad Request` — 클라이언트 입력 오류
- `422 Unprocessable Entity` — 비즈니스 규칙 위반 (예: 잘못된 세션 단계 전환)
- `500 Internal Server Error` — 서버 오류

---

## 안티 패턴 — 하지 말 것

```java
// ❌ Controller에 비즈니스 로직
@PostMapping("/analyze")
public ResponseEntity<?> analyze(@RequestBody AnalysisRequest req) {
    // 왜곡 분류, 점수 계산 등 로직이 여기에 있으면 안 됨
}

// ❌ Optional.get() 직접 호출 — NoSuchElementException 위험
session.findById(id).get();

// ✅ orElseThrow로 명시적 처리
session.findById(id).orElseThrow(() -> new SessionNotFoundException(id));

// ❌ static 메서드로 비즈니스 로직 구현 — 테스트·확장 불가
public static DistortionResult analyze(String text) { ... }

// ❌ 여러 책임을 가진 God Service
public class MindNestService {
    public void analyzeDistortion() { ... }
    public void manageSessions() { ... }
    public void generateReport() { ... }
    public void sendNotification() { ... }
}
```

---

## 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| 클래스 | PascalCase | `SessionService`, `DistortionAnalysisRequest` |
| 메서드 | camelCase, 동사 시작 | `analyzeDistortion()`, `submitTurn()` |
| 상수 | UPPER_SNAKE_CASE | `MAX_CBT_TURNS = 5` |
| 단위 테스트 클래스 | `{대상}Test` | `SessionServiceTest` |
| 통합 테스트 클래스 | `{대상}IntegrationTest` | `SessionControllerIntegrationTest` |
| 패키지 | 소문자, 단수 | `controller`, `service`, `domain` |

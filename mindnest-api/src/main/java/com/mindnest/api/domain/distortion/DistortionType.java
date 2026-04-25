package com.mindnest.api.domain.distortion;

/**
 * 심리학 공식 명칭 기반 인지 왜곡 유형 열거형 (11개)
 *
 * 이 목록은 프롬프트 파일(distortion_analysis.md), 프론트엔드 hints.json과
 * 동일한 명칭을 사용해야 한다. 임의 추가·변경 금지.
 *
 * LLM이 반환하는 name 필드값은 여기 정의된 koreanName 중 하나여야 하며,
 * DistortionAnalysisResultValidator에서 이를 검증한다.
 */
public enum DistortionType {

    ALL_OR_NOTHING("전부 아니면 전무", "상황을 완전한 성공 또는 완전한 실패로만 판단, 중간 지대 없음"),
    OVERGENERALIZATION("지나친 일반화", "하나의 사건·감정을 자신 전체 또는 미래 전체로 확대"),
    MENTAL_FILTERING("정신적 여과", "긍정적인 면을 걸러내고 부정적인 면에만 집중"),
    FORTUNE_TELLING("예언자적 말하기", "근거 없이 나쁜 미래를 확신하며 예측"),
    MIND_READING("독심술 오류", "확실한 근거 없이 타인의 생각·의도를 단정"),
    MAGNIFICATION_MINIMIZATION("극대화·극소화", "부정적 면을 과장하고 긍정적 면을 축소 (또는 반대)"),
    EMOTIONAL_REASONING("감정적 추리", "지금 느끼는 감정이 곧 현실이라고 추론"),
    SHOULD_STATEMENTS("해야 한다는 생각", "자신·타인·세상에 대한 경직된 당위적 기준으로 판단"),
    LABELING("낙인 이론", "행동이 아닌 자신·타인 전체에 부정적 딱지를 붙임"),
    SELF_BLAME("자기 비난", "자신에게 책임 없는 일도 자신의 탓으로 귀인"),
    OTHER_BLAME("타인 비난", "갈등에서 자신의 기여는 보지 못하고 타인만 탓함");

    /** 프롬프트·UI·힌트 조회에 사용하는 한국어 공식 명칭 */
    private final String koreanName;

    /** 사용자에게 보여줄 한 줄 설명 */
    private final String description;

    DistortionType(String koreanName, String description) {
        this.koreanName = koreanName;
        this.description = description;
    }

    public String getKoreanName() {
        return koreanName;
    }

    public String getDescription() {
        return description;
    }

    /**
     * 한국어 명칭으로 enum 값을 찾는다.
     * LLM 응답의 name 필드를 검증할 때 사용.
     *
     * @return 일치하는 유형이 없으면 null
     */
    public static DistortionType fromKoreanName(String koreanName) {
        for (DistortionType type : values()) {
            if (type.koreanName.equals(koreanName)) {
                return type;
            }
        }
        return null;
    }

    /**
     * LLM이 반환한 name 값이 허용된 유형인지 검사한다.
     *
     * @return 허용된 유형이면 true
     */
    public static boolean isValid(String koreanName) {
        return fromKoreanName(koreanName) != null;
    }
}

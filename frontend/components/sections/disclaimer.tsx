import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DisclaimerSection() {
  return (
    <footer className="px-6 pt-16 pb-10">
      <div className="max-w-5xl mx-auto">
        {/* CTA */}
        <div
          className="rounded-3xl p-10 text-center mb-12"
          style={{
            background:
              "linear-gradient(135deg, #FFEDD5 0%, #FFB6C1 50%, #E0BBE4 100%)",
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
            지금 마음을 돌볼 준비가 됐나요?
          </h2>
          <p className="text-gray-600 mb-7 max-w-sm mx-auto">
            5단계 여정을 무료로 시작해보세요.
            <br />
            당신의 이야기를 들을 준비가 되어 있습니다.
          </p>
          <div
            className="inline-block rounded-[14px] p-0.5"
            style={{
              background: "linear-gradient(135deg, #f9a8d4, #c084fc, #a78bfa)",
            }}
          >
            <Button
              asChild
              size="lg"
              className="rounded-xl px-8 text-base bg-white text-gray-800 hover:bg-gray-50"
            >
              <Link href="/session">상담 시작하기</Link>
            </Button>
          </div>
        </div>

        {/* 면책 고지 — CLAUDE.md 필수 표시 항목 */}
        <div className="rounded-2xl border border-amber-100 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30 p-5 mb-8 flex gap-3">
          <span className="text-amber-500 text-xl flex-shrink-0">⚠️</span>
          <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
            <strong>면책 고지:</strong> 본 앱은 전문 심리 치료를 대체하지
            않습니다. 심각한 심리적 어려움이 있다면 전문가 상담을 받으세요.
          </p>
        </div>

        {/* 푸터 */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400 dark:text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-500 dark:text-gray-400">
              MindNest
            </span>
            <span>·</span>
            <span>인지 왜곡 기반 셀프 심리 상담</span>
          </div>
          <p>Phase 1 — 프롬프트 엔지니어링</p>
        </div>
      </div>
    </footer>
  );
}

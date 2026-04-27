import hintsData from "@/data/hints.json";
import type { Distortion } from "@/types/session";

interface DistortionStageProps {
  distortions: Distortion[];
  isLoading: boolean;
}

function getHints(distortionName: string): string[] {
  const found = hintsData.find((h) => h.distortionType === distortionName);
  return found?.hints ?? [];
}

export default function DistortionStage({
  distortions,
  isLoading,
}: DistortionStageProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-pink-200 border-t-pink-400 animate-spin" />
        <p className="text-sm text-gray-500">인지 왜곡 패턴을 분석하는 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-2xl p-5">
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          작성하신 내용에서 아래와 같은 인지 왜곡 패턴이 발견되었어요.
          분석 결과를 확인하고 다음 단계로 넘어가세요.
        </p>
      </div>

      {distortions.map((distortion, i) => {
        const hints = getHints(distortion.name);
        return (
          <div
            key={i}
            className="bg-white/60 dark:bg-white/5 backdrop-blur-sm border border-pink-100 dark:border-white/10 rounded-2xl p-5 space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-300">
                {distortion.name}
              </span>
            </div>

            <blockquote className="text-sm text-gray-500 dark:text-gray-400 italic border-l-2 border-pink-200 pl-3">
              &ldquo;{distortion.quote}&rdquo;
            </blockquote>

            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {distortion.explanation}
            </p>

            {hints.length > 0 && (
              <div className="pt-2 border-t border-gray-100 dark:border-white/10">
                <p className="text-xs font-semibold text-gray-400 mb-2">
                  💡 생각해볼 질문
                </p>
                <ul className="space-y-1">
                  {hints.map((hint, j) => (
                    <li key={j} className="text-xs text-gray-500 dark:text-gray-400">
                      · {hint}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

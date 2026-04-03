"use client";

interface IntakeStageProps {
  sud: number;
  text: string;
  onSUDChange: (value: number) => void;
  onTextChange: (value: string) => void;
}

const SUD_LABELS: Record<number, string> = {
  0: "완전히 평온해요",
  1: "거의 편안해요",
  2: "약간 불편해요",
  3: "조금 힘들어요",
  4: "힘든 편이에요",
  5: "많이 힘들어요",
  6: "꽤 힘들어요",
  7: "매우 힘들어요",
  8: "아주 많이 힘들어요",
  9: "거의 한계예요",
  10: "극도로 힘들어요",
};

export default function IntakeStage({
  sud,
  text,
  onSUDChange,
  onTextChange,
}: IntakeStageProps) {
  return (
    <div className="space-y-8">
      {/* SUD 슬라이더 */}
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-2xl p-6">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          지금 이 순간 감정 강도는?
        </label>
        <p className="text-xs text-gray-400 mb-5">
          0 = 완전히 평온 &nbsp;/&nbsp; 10 = 극도로 힘듦
        </p>

        <div className="text-center mb-4">
          <span className="text-5xl font-bold text-gray-800 dark:text-gray-100">
            {sud}
          </span>
          <p className="text-sm text-gray-500 mt-1">{SUD_LABELS[sud]}</p>
        </div>

        <input
          type="range"
          min={0}
          max={10}
          step={1}
          value={sud}
          onChange={(e) => onSUDChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #f9a8d4 0%, #c084fc ${sud * 10}%, #e5e7eb ${sud * 10}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>0</span>
          <span>5</span>
          <span>10</span>
        </div>
      </div>

      {/* 자유 서술 */}
      <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-white/80 dark:border-white/10 rounded-2xl p-6">
        <label
          htmlFor="intake-text"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1"
        >
          지금 어떤 마음인지 이야기해주세요
        </label>
        <p className="text-xs text-gray-400 mb-4">
          어떤 상황인지, 어떤 생각이 드는지 자유롭게 적어주세요.
        </p>
        <div className="rounded-2xl bg-white dark:bg-white/5 shadow-md focus-within:shadow-pink-100 focus-within:ring-2 focus-within:ring-pink-200 dark:focus-within:ring-purple-800 transition-all duration-200 px-5 py-4">
          <textarea
            id="intake-text"
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="예: 오늘 발표를 망쳤는데, 앞으로 아무도 나를 믿어주지 않을 것 같아요..."
            rows={5}
            className="w-full resize-none bg-transparent border-0 text-base leading-loose text-gray-800 dark:text-gray-200 placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none"
          />
          <p className="text-right text-xs text-gray-300 dark:text-gray-600 mt-1">
            {text.length}자
          </p>
        </div>
      </div>
    </div>
  );
}

import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

interface Feedback {
  overall_rating: number;
  ats_compatibility: number;
  content_quality: number;
  design_and_formatting: number;
  detailed_feedback?: {
    summary?: string;
    strengths?: string[];
    weaknesses?: string[];
  };
}

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70 ? "text-green-600" : score > 49 ? "text-yellow-600" : "text-red-600";

  return (
    <div className="resume-summary p-4 border-t border-gray-200">
      <div className="category flex flex-row gap-4 items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-xl font-medium">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-xl font-semibold">
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  const overallScore = Math.round((feedback.overall_rating / 5) * 100);
  const summary = feedback.detailed_feedback?.summary ?? "";
  const strengths = feedback.detailed_feedback?.strengths ?? [];
  const weaknesses = feedback.detailed_feedback?.weaknesses ?? [];

  return (
    <div className="bg-white rounded-2xl shadow-md w-full">
      {/* Overall Score Header */}
      <div className="flex flex-row items-center p-6 gap-8">
        <ScoreGauge score={overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the factors below.
          </p>
          {summary && (
            <p className="text-sm text-gray-600 mt-2">{summary}</p>
          )}
        </div>
      </div>

      {/* Category Scores */}
      <Category title="Tone & Style" score={feedback.ats_compatibility ?? 0} />
      <Category title="Content" score={feedback.content_quality ?? 0} />
      <Category title="Structure" score={feedback.design_and_formatting ?? 0} />
      <Category title="Skills" score={70} /> {/* optional static or derived */}

      {/* Strengths & Weaknesses */}
      <div className="p-6 pt-0">
        {strengths.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-green-600 mb-2">Strengths</h3>
            <ul className="space-y-1">
              {strengths.slice(0, 3).map((s, i) => (
                <li key={`strength-${i}`} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}

        {weaknesses.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-amber-600 mb-2">Areas for Improvement</h3>
            <ul className="space-y-1">
              {weaknesses.slice(0, 3).map((w, i) => (
                <li key={`weakness-${i}`} className="text-sm text-gray-700 flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">⚠</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;

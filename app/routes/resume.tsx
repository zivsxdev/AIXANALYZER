import { Link, useNavigate, useParams } from "react-router";
import { useEffect, useState } from "react";
import { usePuterStore } from "~/lib/puter";
import Summary from "~/components/Summary";
import ATS from "~/components/ATS";
import Details from "~/components/Details";


export const meta = () => ([
  { title: 'Resumind | Review' },
  { name: 'description', content: 'Detailed overview of your resume' },
]);

interface Feedback {
  overall_rating: number;
  rating_breakdown: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  specific_improvements: string[];
  ATS?: {
    score?: number;
    tips?: string[];
  };
}

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const { id } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth?.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth, navigate, id]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);
      if (!resume) return;

      const data = JSON.parse(resume);

      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) return;
      const resumeUrl = URL.createObjectURL(new Blob([resumeBlob], { type: 'application/pdf' }));
      setResumeUrl(resumeUrl);

      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) return;
      const imageUrl = URL.createObjectURL(new Blob([imageBlob]));
      setImageUrl(imageUrl);

      setFeedback(data.feedback);

      console.log({
        resumeUrl,
        imageUrl,
        feedback: data.feedback,
      });
    };

    loadResume();
  }, [id, fs, kv]);

  return (
    <div className="!pt-0 overflow-hidden">
      <nav className="resume-nav z-10">
        <Link to="/" className="back-button flex items-center gap-1">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        {/* Left section – Resume Image */}
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover max-h-[90vh] overflow-hidden sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume"
                  alt="resume preview"
                />
              </a>
            </div>
          )}
        </section>

        {/* Right section – Review */}
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>

          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS
                score={feedback?.ATS?.score ?? 0}
                suggestions={feedback?.ATS?.tips ?? []}
              />
               <Details feedback={feedback} />
          
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" className="w-full" alt="scanning..." />
          )}
        </section>
      </div>
    </div>
  );
};

export default Resume;

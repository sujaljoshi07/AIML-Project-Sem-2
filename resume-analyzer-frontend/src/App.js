import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [jobDesc, setJobDesc] = useState("");
  const [animatedScore, setAnimatedScore] = useState(0);

  const handleFile = async (file) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("job_desc", jobDesc);

    const res = await axios.post("http://127.0.0.1:5000/analyze", formData);
    setData(res.data);
    setLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  useEffect(() => {
    if (data) {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setAnimatedScore(i);
        if (i >= data.score) clearInterval(interval);
      }, 10);
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-[#020617] text-white relative overflow-hidden">

      {/* SUBTLE BACKGROUND BLOBS */}
      <div className="absolute w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl top-[-100px] left-[-100px]" />
      <div className="absolute w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl bottom-[-100px] right-[-100px]" />

      <div className="max-w-6xl mx-auto px-6 py-10 relative z-10">

        {/* HEADER */}
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">
          Resume Analyzer
        </h1>
        <p className="text-gray-300 mt-2">
          AI-powered resume insights and job matching
        </p>

        {/* UPLOAD */}
        <motion.div
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
          className={`mt-8 p-10 rounded-2xl border transition
          ${drag
            ? "border-cyan-400 bg-cyan-500/10"
            : "border-white/10 bg-[#0F172A]"}
          `}
        >
          <p className="text-center text-gray-300">Drag & drop resume</p>

          <input
            type="file"
            onChange={(e) => handleFile(e.target.files[0])}
            className="mt-4 block mx-auto text-sm"
          />

          <textarea
            placeholder="Paste job description (optional)"
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            className="mt-6 w-full p-3 rounded bg-[#020617] border border-gray-700 focus:border-indigo-400 outline-none"
          />
        </motion.div>

        {/* LOADING */}
        {loading && (
          <div className="mt-6 text-cyan-400 animate-pulse">
            Analyzing...
          </div>
        )}

        {/* DASHBOARD */}
        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

            {/* SCORE */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl bg-[#0F172A] border border-white/10"
            >
              <p className="text-gray-300">Score</p>

              <h2 className="text-5xl font-bold text-indigo-400">
                {animatedScore}
              </h2>

              <div className="mt-4 h-2 bg-gray-800 rounded">
                <div
                  className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all"
                  style={{ width: `${data.score}%` }}
                />
              </div>

              {data.job_match !== null && (
                <p className="mt-2 text-cyan-400">
                  Job Match: {data.job_match}%
                </p>
              )}
            </motion.div>

            {/* SKILLS */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl bg-[#0F172A] border border-white/10"
            >
              <p className="text-gray-300 mb-2">Skills</p>

              <div className="flex flex-wrap gap-2">
                {data.skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-sm rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 hover:bg-cyan-400/40 transition"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* BREAKDOWN */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl bg-[#0F172A] border border-white/10"
            >
              <p className="text-gray-300 mb-2">Breakdown</p>

              {[
                ["Skills", data.skill_score],
                ["Length", data.length_score],
                ["Sections", data.section_score]
              ].map(([label, value], i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>

                  <div className="h-2 bg-gray-800 rounded mt-1">
                    <div
                      className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                      style={{ width: `${(value / 40) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* SUGGESTIONS */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl bg-[#0F172A] border border-white/10"
            >
              <p className="text-gray-300 mb-2">Suggestions</p>

              <ul className="text-sm text-gray-300 space-y-1">
                {data.suggestions.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </motion.div>

            {/* AI FEEDBACK */}
            <motion.div
              whileHover={{ y: -5 }}
              className="p-6 rounded-xl bg-[#0F172A] border border-white/10 md:col-span-2"
            >
              <p className="text-gray-300 mb-2">AI Feedback</p>

              <ul className="text-sm text-gray-300 space-y-1">
                {data.feedback.map((f, i) => (
                  <li key={i}>💡 {f}</li>
                ))}
              </ul>
            </motion.div>

          </div>
        )}

      </div>
    </div>
  );
}

export default App;
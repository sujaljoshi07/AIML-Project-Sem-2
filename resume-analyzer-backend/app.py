from flask import Flask, request, jsonify
from flask_cors import CORS
import PyPDF2

app = Flask(__name__)
CORS(app)

# -------------------------------
# SKILLS DATABASE
# -------------------------------
SKILLS = {
    "Python": ["python"],
    "Java": ["java"],
    "Machine Learning": ["ml", "machine learning"],
    "SQL": ["sql"],
    "JavaScript": ["js", "javascript"],
    "HTML": ["html"],
    "CSS": ["css"]
}

# -------------------------------
# EXTRACT TEXT
# -------------------------------
def extract_text(file):
    text = ""
    reader = PyPDF2.PdfReader(file)
    for page in reader.pages:
        if page.extract_text():
            text += page.extract_text()
    return text.lower()

# -------------------------------
# ANALYSIS + AI FEEDBACK
# -------------------------------
def analyze(text):
    found_skills = []

    for skill, variations in SKILLS.items():
        for v in variations:
            if v in text:
                found_skills.append(skill)
                break

    skill_score = min(len(found_skills) * 10, 40)
    word_count = len(text.split())

    length_score = 20 if 300 <= word_count <= 800 else 10
    sections = ["education", "experience", "skills", "projects"]
    section_score = sum(5 for s in sections if s in text)

    total_score = min(skill_score + length_score + section_score, 100)

    # Suggestions
    suggestions = []
    if total_score < 60:
        suggestions.append("Add measurable achievements and improve clarity")
    if len(found_skills) < 4:
        suggestions.append("Include more relevant technical skills")
    if word_count < 300:
        suggestions.append("Expand your resume with more detail")
    elif word_count > 800:
        suggestions.append("Keep your resume concise")
    suggestions.append("Use action verbs like 'developed', 'built', 'optimized'")

    # AI Feedback
    feedback = []
    if total_score > 80:
        feedback.append("Strong resume with solid structure and skills.")
    elif total_score > 60:
        feedback.append("Decent resume but can be improved further.")
    else:
        feedback.append("Resume needs significant improvement.")

    if "projects" not in text:
        feedback.append("Add a projects section to show practical experience.")
    if "experience" not in text:
        feedback.append("Include work experience or internships.")

    return {
        "score": total_score,
        "skills": found_skills,
        "word_count": word_count,
        "skill_score": skill_score,
        "length_score": length_score,
        "section_score": section_score,
        "suggestions": suggestions,
        "feedback": feedback
    }

# -------------------------------
# API ROUTE
# -------------------------------
@app.route("/analyze", methods=["POST"])
def analyze_resume():
    try:
        file = request.files.get("file")
        job_desc = request.form.get("job_desc", "")

        if not file:
            return jsonify({"error": "No file uploaded"}), 400

        text = extract_text(file)
        result = analyze(text)

        # Job Match
        if job_desc:
            jd_words = set(job_desc.lower().split())
            resume_words = set(text.split())
            match = len(jd_words & resume_words) / max(len(jd_words), 1)
            result["job_match"] = int(match * 100)
        else:
            result["job_match"] = None

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------------------------------
# RUN
# -------------------------------
if __name__ == "__main__":
    app.run(debug=True)
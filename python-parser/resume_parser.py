"""
resume_parser.py

Basic resume PDF parser for Review 2 of the AI-Based Resume Analyzer project.

Responsibilities (kept intentionally simple for this phase):
  1. Open a PDF resume.
  2. Extract raw text from every page.
  3. Clean up basic whitespace.
  4. Match against a predefined list of known skills.
  5. Print a structured JSON object to stdout so Node.js can consume it.

This module is called by backend/utils/pythonRunner.js as:
    python3 resume_parser.py <path_to_pdf>

Keep this file modular -- extract_text(), clean_text(), and extract_skills()
are separate functions on purpose so a future phase can drop in a proper NLP
pipeline (spaCy / regex-based entity extraction / transformer models)
without rewriting the whole script.
"""

import sys
import json
import re

import pymupdf as fitz  # PyMuPDF (using the non-deprecated import path;
                         # `import fitz` directly prints a deprecation
                         # warning to stdout, which would corrupt the JSON
                         # that Node.js reads from this script's output)

# Predefined skill list relevant to this project's tech stack.
# NOTE: Java is intentionally excluded, per project requirements.
KNOWN_SKILLS = [
    "Python",
    "JavaScript",
    "C",
    "C++",
    "HTML",
    "CSS",
    "React.js",
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "MySQL",
    "SQL",
    "Git",
    "GitHub",
    "REST API",
    "Machine Learning",
    "NLP",
]


def extract_text(pdf_path: str) -> str:
    """Open the PDF and read text from every page."""
    text_parts = []
    with fitz.open(pdf_path) as doc:
        for page in doc:
            text_parts.append(page.get_text())
    return "\n".join(text_parts)


def clean_text(raw_text: str) -> str:
    """Collapse extra whitespace/newlines so the extracted text is tidy."""
    # Replace multiple whitespace characters (including newlines) with a single space
    cleaned = re.sub(r"[ \t]+", " ", raw_text)
    cleaned = re.sub(r"\n{2,}", "\n", cleaned)
    return cleaned.strip()


def extract_skills(text: str) -> list:
    """Very simple keyword-matching skill extraction.

    This is a placeholder for Review 2. It can be replaced later with a
    proper NLP pipeline (e.g. spaCy NER, transformer-based extraction).

    Uses word boundaries so short skill names (e.g. "C", "SQL") don't match
    as substrings of unrelated words (e.g. "Computer", "SQLite" vs "SQL").
    \b doesn't work well around "C++" or "Node.js" since +/. aren't word
    characters, so those are matched with a lookaround-free literal search
    guarded by surrounding non-alphanumeric characters instead.
    """
    text_lower = text.lower()
    found_skills = []

    for skill in KNOWN_SKILLS:
        skill_lower = skill.lower()
        escaped = re.escape(skill_lower)

        if re.fullmatch(r"[a-z0-9]+", skill_lower):
            # Plain alphanumeric skill name (e.g. "python", "sql") -- safe
            # to use standard word boundaries.
            pattern = rf"\b{escaped}\b"
        else:
            # Skill names containing symbols (e.g. "c++", "node.js",
            # "rest api") -- require a non-alphanumeric or string boundary
            # on each side instead of \b.
            pattern = rf"(?<![a-z0-9]){escaped}(?![a-z0-9])"

        if re.search(pattern, text_lower):
            if skill not in found_skills:
                found_skills.append(skill)

    return found_skills


def parse_resume(pdf_path: str) -> dict:
    raw_text = extract_text(pdf_path)
    cleaned_text = clean_text(raw_text)
    skills = extract_skills(cleaned_text)

    return {
        "skills": skills,
        "text": cleaned_text,
    }


def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No PDF path provided"}))
        sys.exit(1)

    pdf_path = sys.argv[1]

    try:
        result = parse_resume(pdf_path)
        print(json.dumps(result))
    except Exception as exc:  # noqa: BLE001 - top-level guard for the CLI entrypoint
        print(json.dumps({"error": str(exc)}))
        sys.exit(1)


if __name__ == "__main__":
    main()

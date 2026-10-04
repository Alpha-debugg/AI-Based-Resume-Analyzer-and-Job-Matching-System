// utils/pythonRunner.js
// Spawns the Python resume parser as a child process and returns parsed JSON.
// Kept as an isolated module so the Python integration can be swapped for a
// proper microservice/queue setup in a later phase without touching controllers.

const { spawn } = require('child_process');
const path = require('path');

const PYTHON_PATH = process.env.PYTHON_PATH || 'python3';
const PARSER_SCRIPT = path.join(__dirname, '..', '..', 'python-parser', 'resume_parser.py');

/**
 * Runs the Python parser on a given PDF file path.
 * @param {string} pdfFilePath - Absolute path to the uploaded PDF.
 * @returns {Promise<{skills: string[], text: string}>}
 */
function runResumeParser(pdfFilePath) {
  return new Promise((resolve, reject) => {
    const pythonProcess = spawn(PYTHON_PATH, [PARSER_SCRIPT, pdfFilePath]);

    let stdout = '';
    let stderr = '';

    pythonProcess.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python parser exited with code ${code}: ${stderr}`));
      }
      try {
        const result = JSON.parse(stdout);
        resolve(result);
      } catch (err) {
        reject(new Error(`Failed to parse Python output as JSON: ${err.message}`));
      }
    });

    pythonProcess.on('error', (err) => {
      reject(new Error(`Failed to start Python process: ${err.message}`));
    });
  });
}

module.exports = { runResumeParser };

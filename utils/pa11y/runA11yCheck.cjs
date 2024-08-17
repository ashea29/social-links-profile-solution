const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);
const pa11y = require("pa11y");
const { html, css, js } = require("./templates.cjs");
const { argv } = require("process");

const pageNameForReport = argv.slice(2).join(" ");

async function runPa11y() {
  const results = await pa11y("http://localhost:5173", {
    standard: "WCAG2AA",
    includeNotices: true,
    includeWarnings: true,
  });

  const issues = results.issues;

  let errorCount = issues.filter((issue) => issue.type === "error").length;
  let warningCount = issues.filter((issue) => issue.type === "warning").length;
  let noticeCount = issues.filter((issue) => issue.type === "notice").length;
  let allCount = errorCount + warningCount + noticeCount;
  let fixedCount = 0;

  // Escape HTML
  function escapeHtml(unsafe) {
    if (!unsafe) return;
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  const renderedHTML = html(
    issues,
    allCount,
    errorCount,
    warningCount,
    noticeCount,
    fixedCount,
    pageNameForReport,
    escapeHtml
  );

  const rootDir = path.resolve(__dirname, "..", "..");

  const fileCleanup = `rm -rf ${path.resolve(
    rootDir,
    "utils",
    "pa11y",
    "results"
  )}`;

  const createOutputDir = `mkdir ${path.resolve(
    rootDir,
    "utils",
    "pa11y",
    "results"
  )}`;

  const createOutputFile = `touch ${path.resolve(
    rootDir,
    "utils",
    "pa11y",
    "results",
    "index.html"
  )}`;

  // Start by executing the 'fileCleanup' command
  exec(fileCleanup, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log("File cleanup successful");

    // If no errors, execute the 'createOutputDir' command
    exec(createOutputDir, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log("Output directory created");

      // If no errors, execute the 'createOutputFile' command
      exec(createOutputFile, async (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }

        // If no errors, create the 'index.html', 'style.css', and 'script.js' files
        try {
          await writeFile(
            `${path.resolve(
              rootDir,
              "utils",
              "pa11y",
              "results",
              "index.html"
            )}`,
            renderedHTML
          );
          await writeFile(
            `${path.resolve(
              rootDir,
              "utils",
              "pa11y",
              "results",
              "style.css"
            )}`,
            css
          );
          await writeFile(
            `${path.resolve(
              rootDir,
              "utils",
              "pa11y",
              "results",
              "script.js"
            )}`,
            js
          );
        } catch (error) {
          console.error(`Error writing CSS: ${error}`);
        }

        // If no errors, print a success message
        try {
          const { default: chalk } = await import("chalk");
          console.log(
            chalk.cyan(
              `Accessibility report for '${pageNameForReport}' written to 'utils/pa11y/results/index.html' 🚀`
            )
          );
        } catch (error) {
          console.error(`Error with dynamic import: ${error}`);
        }
      });
    });
  });
}

runPa11y();

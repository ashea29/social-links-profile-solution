const html = (
  issues,
  allCount,
  errorCount,
  warningCount,
  noticeCount,
  fixedCount,
  pageNameForReport,
  escapeHtml
) =>
  `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Accessibility Report For "${pageNameForReport}"</title>
      <link rel="stylesheet" href="style.css" />
    </head>
    <body>
      <main class="page">
        <h1 class="page__heading">Accessibility Report For "${pageNameForReport}"</h1>
        <h2 class="page__subheading">Generated: ${new Date().toLocaleString()}</h2>

        <p class="counts">
          <span id="all-count" class="count all"><span>${allCount}</span> issues</span>
          <span id="error-count" class="count error"><span>${errorCount}</span> errors</span>
          <span id="warning-count" class="count warning"><span>${warningCount}</span> warnings</span>
          <span id="notice-count" class="count notice"><span>${noticeCount}</span> notices</span>
          <span id="fixed-count" class="count fixed"><span>${fixedCount}</span> fixed</span>
        </p>

      ${
        issues.length === 0
          ? `<h3>No issues found</h3>`
          : `<ul id="issues-list" class="clean-list results-list">
      ${issues
        .map(
          (issue) =>
            `<li data-type="${issue.type}" class="result ${issue.type}">
            <div class="li__content">
              <h4>${issue.type}: ${issue.message}</h4>
              <p>${issue.code}</p>
              <pre>${escapeHtml(issue.context)} (select with "${
              issue.selector
            }")</pre>
            </div>
            <div class="li__checkbox">
              <label for="fixed-checkbox">Addressed?</label>
              <input id="fixed-checkbox" name="fixed-checkbox" type="checkbox" />
            </div>
          </li>`
        )
        .join("\n")}</ul>`
      }
    </main>

    <script src="script.js"></script>
    </body>
  </html>
`.trim();

const css = `
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .hidden {
    display: none !important;
  }

  .page__heading,
  .page__subheading {
    text-align: center;
  }

  .page__heading {
    margin-bottom: 1.5rem;
  }

  .page__subheading {
    margin-bottom: 3rem;
    font-weight: 400;
  }

  #loader {
    display: none;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  li {
    margin-bottom: 15px;
    width: 100%;
  }

  h1, h2, p, pre, ul {
    margin-top: 0;
    margin-bottom: 0;
  }

  h2 {
    font-size: 1.25rem;
  }

  pre {
    white-space: pre-wrap;
    overflow: auto;
  }

  .page {
    max-width: 1000px;
    margin: 0 auto;
    padding: 25px;
  }

  .counts {
    margin-top: 30px;
    font-size: 20px;
  }

  .count {
    display: inline-block;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid #eee;
    cursor: pointer;
  }

  .clean-list {
    margin-left: 0;
    padding-left: 0;
    list-style: none;
  }

  .results-list {
    margin-top: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .result {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 3rem;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #eee;
  }

  .li__checkbox {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-right: 0.75rem;

    & input[type="checkbox"] {
      width: 20px;
      height: 20px;
    }
  }

  .result:has(.li__checkbox > input[type="checkbox"]:checked) > .li__content {
    text-decoration: line-through;
  }

  .error {
    background-color: #fdd;
    border-color: #ff9696;
  }
  .warning {
    background-color: #ffd;
    border-color: #e7c12b;
  }
  .notice {
    background-color: #eef4ff;
    border-color: #b6d0ff;
  }

  .fixed {
    background-color: hsl(120, 73%, 90%);
    border-color: hsl(120, 73%, 50%);
  }

  .all {
    background-color: #fff;
    border: 1px solid #999;
  }
`.trim();

const js = `
    const issuesList = document.getElementById("issues-list");
    const errorFilterButton = document.getElementById("error-count");
    const noticeFilterButton = document.getElementById("notice-count");
    const warningFilterButton = document.getElementById("warning-count");
    const showAllButton = document.getElementById("all-count");
    const fixedFilterButton = document.getElementById("fixed-count");

    const listItems = Array.from(issuesList.querySelectorAll("li"));
    const fixedCheckboxes = document.querySelectorAll(
      '.li__checkbox > input[type="checkbox"]'
    );

    let fixedCount = parseInt(fixedFilterButton.firstElementChild.innerText);
    let allCount = parseInt(showAllButton.firstElementChild.innerText);
    let errorCount = parseInt(errorFilterButton.firstElementChild.innerText);
    let warningCount = parseInt(warningFilterButton.firstElementChild.innerText);
    let noticeCount = parseInt(noticeFilterButton.firstElementChild.innerText);

    fixedCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        let initialType =
          event.target.parentElement.parentElement.getAttribute("data-type");

        if (event.target.checked) {
          event.target.parentElement.parentElement.classList.remove(
            initialType
          );
          event.target.parentElement.parentElement.classList.add(
            "fixed",
            "hidden"
          );

          ++fixedCount;
          --allCount;

          if (initialType === "error") {
            --errorCount;
          } else if (initialType === "warning") {
            --warningCount;
          } else if (initialType === "notice") {
            --noticeCount;
          }

          fixedFilterButton.firstElementChild.innerText = fixedCount.toString();
          showAllButton.firstElementChild.innerText = allCount.toString();
          errorFilterButton.firstElementChild.innerText = errorCount.toString();
          warningFilterButton.firstElementChild.innerText =
            warningCount.toString();
          noticeFilterButton.firstElementChild.innerText =
            noticeCount.toString();
        } else {
          event.target.parentElement.parentElement.classList.remove(
            "fixed",
            "hidden"
          );
          event.target.parentElement.parentElement.classList.add(
            initialType,
            "hidden"
          );

          --fixedCount;
          ++allCount;

          if (initialType === "error") {
            ++errorCount;
          } else if (initialType === "warning") {
            ++warningCount;
          } else if (initialType === "notice") {
            ++noticeCount;
          }

          showAllButton.firstElementChild.innerText = allCount.toString();
          errorFilterButton.firstElementChild.innerText = errorCount.toString();
          warningFilterButton.firstElementChild.innerText =
            warningCount.toString();
          noticeFilterButton.firstElementChild.innerText =
            noticeCount.toString();
          fixedFilterButton.firstElementChild.innerText = fixedCount.toString();
        }
      });
    });

    showAllButton.addEventListener("click", () => {
      listItems.forEach((item) => {
        if (item.classList.contains("fixed")) {
          item.classList.add("hidden");
        }
        if (
          item.classList.contains("hidden") &&
          !item.classList.contains("fixed")
        ) {
          item.classList.remove("hidden");
        }
      });
    });

    errorFilterButton.addEventListener("click", () => {
      listItems.forEach((item) => {
        if (item.classList.contains("fixed")) {
          item.classList.add("hidden");
        }

        if (
          item.classList.contains("hidden") &&
          !item.classList.contains("fixed")
        ) {
          item.classList.remove("hidden");
        }

        if (!item.classList.contains("error")) {
          item.classList.add("hidden");
        }
      });
    });

    noticeFilterButton.addEventListener("click", () => {
      listItems.forEach((item) => {
        if (item.classList.contains("fixed")) {
          item.classList.add("hidden");
        }

        if (
          item.classList.contains("hidden") &&
          !item.classList.contains("fixed")
        ) {
          item.classList.remove("hidden");
        }

        if (!item.classList.contains("notice")) {
          item.classList.add("hidden");
        }
      });
    });

    warningFilterButton.addEventListener("click", () => {
      listItems.forEach((item) => {
        if (item.classList.contains("fixed")) {
          item.classList.add("hidden");
        }

        if (
          item.classList.contains("hidden") &&
          !item.classList.contains("fixed")
        ) {
          item.classList.remove("hidden");
        }

        if (!item.classList.contains("warning")) {
          item.classList.add("hidden");
        }
      });
    });

    fixedFilterButton.addEventListener("click", () => {
      listItems.forEach((item) => {
        if (item.classList.contains("hidden")) {
          item.classList.remove("hidden");
        }

        if (!item.classList.contains("fixed")) {
          item.classList.add("hidden");
        }
      });
    });
`.trim();

module.exports = {
  html,
  css,
  js,
};

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
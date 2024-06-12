/**
 * Intent: Auto-navigate to "Files Changed" tab when opening a Pull Request from the Pull Requests list
 */

const mutationObserver = new MutationObserver(onMutation);
observe();

function onMutation() {
  const url = window.location.href;

  if (url.includes("pull-requests")) { // Only execute if on the "Pull Requests" page
    const splitUrl = url.split("pull-requests");
    if (splitUrl && splitUrl.length > 1) {
      const pullRequestPath = splitUrl[1];

      if (shouldRedirectToFilesChangedTab(pullRequestPath)) {
        mutationObserver.disconnect();
        const selectorForFilesChangedLink = 'a[id="pull-request-tabs-1"]';
        pollUntilElementFoundAndThenClick(selectorForFilesChangedLink);
        observe();
      }
    }
  }
}

// ------------------- Util Functions ------------------------- //

/**
 * Decides whether to redirect to the "Files Changed" tab in PR Details.
 * We should not redirect if the user explicitly clicks on the "Overview" tab or if the user is on any other PR page, like "Commits" or "new"
 * If explicitly clicked on "Overview",the URL path ends with /overview, which is ignored in this function.
 * If user navigates to a specific PR from the PRs list view, then the url path ends with the PR number, which is when we redirect.
 * 
 * @param {string} currentPRPagePath 
 * @returns {boolean}
 */
function shouldRedirectToFilesChangedTab(currentPRPagePath) {
  const regexForEndsWithSlashAndDigits = /\/\d+$/;
  const endsWithSlashAndNumbers = regexForEndsWithSlashAndDigits.test(currentPRPagePath);
  return (
    currentPRPagePath &&
    currentPRPagePath !== "" &&
    endsWithSlashAndNumbers
  );
}

function pollUntilElementFoundAndThenClick(elementSelector) {
  const isElementRendered = setInterval(() => {
    if (document.querySelector(elementSelector)) {
      const element = document.querySelector(elementSelector);
      element.click();
      clearInterval(isElementRendered);
    }
  }, 100);
}

function observe() {
  mutationObserver.observe(document, {
    subtree: true,
    childList: true,
  });
}

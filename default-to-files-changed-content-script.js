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
 * We should not redirect if the user explicitly clicks on the "Overview" tab or if the user is on any other PR page, like "Commits", "new", "update" etc
 * If the current URL is not /<some-digits>/overview (or commits or diff), then we attempt to redirect to Files Changed tab.
 * Worst case, even if this function returns true incorrectly, the pollUntilElementFoundAndThenClick function will fail to find the "Files Changed" link
 * 
 * @param {string} currentPRPagePath 
 * @returns {boolean}
 */
function shouldRedirectToFilesChangedTab(currentPRPagePath) {
  const regexSlashNumberAndNonRedirectUrlPaths = /\/\d+\/(overview|commits|diff)$/
  const urlEndsWithNonRedirectPaths = regexSlashNumberAndNonRedirectUrlPaths.test(currentPRPagePath);

  return (
    currentPRPagePath &&
    currentPRPagePath !== "" &&
    !urlEndsWithNonRedirectPaths
  );
}

function pollUntilElementFoundAndThenClick(elementSelector, maxAttempts = 200) {
  let attempts = 0;
  const isElementRendered = setInterval(() => {
    attempts++;
    const element = document.querySelector(elementSelector);
    if (element) {
      element.click();
      clearInterval(isElementRendered);
    } else if (attempts >= maxAttempts) {
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

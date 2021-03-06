var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

var getRepoName = function() {
    // grab repo name from url query string
    var querySting = document.location.search;
    var repoName = querySting.split("=")[1];
    if (repoName) {
        // display repo name on page
        repoNameEl.textContent = repoName;
        // pass repo name to get issues
        getRepoIssues(repoName);
    } else {
        // if no repo was give, redirect to homepage
        document.location.replace("./index.html");
    }
    
}

var getRepoIssues = function(repo) {
    var apiURL = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

    fetch(apiURL).then(function(response) {
        // if request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to DOM function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                    displayWarning(repo);
                }
            })
        } else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
}

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }

    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on GitHub
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank");

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;
        issueEl.appendChild(titleEl);

        // create span to hold issue type
        var typeEl = document.createElement("span");
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull Request)";
        } else {
            typeEl.textContent = "(Issue)";
        }
        issueEl.appendChild(typeEl);

        // append to DOM
        issueContainerEl.appendChild(issueEl);
    }
}

var displayWarning = function(repo) {
    limitWarningEl.textContent = "This repository has more than 30 issues. ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See more issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");
    limitWarningEl.appendChild(linkEl);
}

getRepoName();
/*jshint esversion: 8 */
var blogInfo = {};

/**
 *
 * @param {JSON} json
 */

let MaxResult = 6;
let MaxSKillsResult = 9;
let MaxTimeLinesResult = 6;
let screenSize = window.screen.availWidth;

window.localStorage.setItem("currIndex", 1);
window.localStorage.setItem("currSkillsIndex", 1);
window.localStorage.setItem("currTimeLineIndex", 1);

async function creteProjectsPagination(elem, max, label = "projects") {
  let allPosts = blogInfo[label].totalPosts,
    totalIndexes = Math.max(allPosts / max) + 1,
    curr = parseInt(localStorage.getItem("currIndex")),
    lists;

  if (totalIndexes != 1) {
    lists = `<a class='main-btn' id="prev" onclick="loadPosts('prev', '${label}', false)" class="pagination-item ${
      curr <= MaxResult ? "disable" : ""
    }">
                <i class="fa-solid fa-angle-left"></i>

            </a>\n`;

    lists += `<a class='main-btn' id="next" onclick="loadPosts('next', '${label}', false)" class="pagination-item ${
      curr >= blogInfo.totalPosts ? "disable" : ""
    }">
              
                <i class="fa-solid fa-angle-right"></i>
            </a>`;
  }

  s(elem).innerHTML = lists;
}
async function creteLoadMore(elem, max, fname, indxName, label) {
  let allPosts = blogInfo[label].totalPosts,
    totalIndexes = Math.max(allPosts / max),
    curr = parseInt(localStorage.getItem(indxName)),
    lists;
  if (totalIndexes != 1) {
    lists = `<a class="main-btn" id="next" onclick="${fname}('next')" class="pagination-item ${
      curr >= blogInfo[label]["totalPosts"] ? "disable" : ""
    }">
            <span class="text">Show More</span>
                  <span class="material-icons-round icon">
                    add_circle_outline
                  </span>
            </a>`;
  }

  s(elem).innerHTML = lists;
}

function updateCurrIndex(num, label, MaxResult, indexName = "currIndex") {
  if (typeof num == "string") {
    if (num == "prev" && localStorage.getItem(indexName) > MaxResult) {
      let curr = parseInt(localStorage.getItem(indexName));
      localStorage.setItem(indexName, curr - MaxResult);
    } else if (
      num == "next" &&
      localStorage.getItem(indexName) < blogInfo[label].totalPosts
    ) {
      let curr = parseInt(localStorage.getItem(indexName));
      localStorage.setItem(indexName, curr + MaxResult);
    }
  } else {
    localStorage.setItem(indexName, num);
  }
  return localStorage.getItem(indexName);
}

function createUrl(num, MaxResult, label = "all", indexName = "currIndex") {
  let link;
  if (typeof num == "string") {
    if (num == "prev" && localStorage.getItem(indexName) > MaxResult) {
      let curr = parseInt(localStorage.getItem(indexName));
      return (
        "http://localhost:8080/" +
        `https://osama-portfolio.blogspot.com/feeds/posts/summary${
          label == "all" ? "" : "/-/" + label
        }?max-results=${MaxResult}&start-index=${curr - MaxResult}&alt=json`
      );
    } else if (
      num == "next" &&
      localStorage.getItem(indexName) < blogInfo[label].totalPosts
    ) {
      let curr = parseInt(localStorage.getItem(indexName));
      return (
        "http://localhost:8080/" +
        `https://osama-portfolio.blogspot.com/feeds/posts/summary${
          label == "all" ? "" : "/-/" + label
        }?max-results=${MaxResult}&start-index=${curr + MaxResult}&alt=json`
      );
    }
  } else {
    return (
      "http://localhost:8080/" +
      `https://osama-portfolio.blogspot.com/feeds/posts/summary${
        label == "all" ? "" : "/-/" + label
      }?max-results=${MaxResult}&start-index=${num}&alt=json`
    );
  }
}

async function loadPosts(num, label = "projects", noScroll = true) {
  let link =
      num.indexOf("http") != -1
        ? num
        : createUrl(num, MaxResult, label, "currIndex"),
    postHtml = "",
    postShowElem = s("#projects-list");
  let currIndex = parseInt(localStorage.getItem("currIndex")),
    loader = document.body;

  if (link != undefined) {
    if (currIndex != num) {
      loader.classList.add("loading");
      fetch(link, {})
        .then((res) => res.json())
        .then((data) => {
          blogInfo = Object.assign(
            {
              [label]: {
                totalPosts: parseInt(data.feed.openSearch$totalResults.$t),
              },
            },
            blogInfo
          );

          currIndex = parseInt(localStorage.getItem("currIndex"));
          let posts = data.feed.entry;
          if (Array.isArray(posts)) {
            updateCurrIndex(num, label, MaxResult, "currIndex");
            for (let post of posts) {
              let summary = post.summary.$t,
                gitLink = summary.slice(
                  summary.search("git"),
                  summary.search(",", summary.search("git") + 1)
                ),
                behanceLink = summary.slice(summary.search("b:")).split(",")[0],
                youtubeLink = summary.slice(summary.search("y")).split(",")[0];
              gitLink = gitLink.slice(gitLink.search(":") + 1).trim();
              behanceLink = behanceLink
                .slice(behanceLink.search(":") + 1)
                .trim();
              youtubeLink = youtubeLink
                .slice(youtubeLink.search(":") + 1)
                .trim();
              postHtml += `
              <div class="project-card">
              <img
                src="${post.media$thumbnail.url.replace(
                  /s72-(\w+)?-(\w+)?-c/,
                  "s2110"
                )}"
                alt="${post.title.$t}"
              />
              <div class="project-ifo">
                <div class="project-title">
                  <h4>${post.title.$t}</h4>
                </div>
                <div class="pr-src">
                  <h4>Project Source</h4>
                  <div class="src-icons">
                    <a target="_blank" href="${gitLink}">
                      <i class="fa fa-github" aria-hidden="true"></i>
                    </a>
                    <a  target="_blank" href="${behanceLink}">
                      <i class="fab fa-behance"></i>
                    </a>
                    <a  target="_blank" href="${youtubeLink}">
                      <i class="fa fa-youtube" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
                      `;
            }
            postShowElem.innerHTML = postHtml;
            if (!noScroll) {
              postShowElem.scrollIntoView();
            }
            creteProjectsPagination(
              "#projects-pagenation",
              MaxResult,
              "projects"
            );
            loader.classList.remove("loading");
          } else {
            swal("Portfolio Projects", "We Work To add More Projects");
            loader.classList.remove("loading");
          }
        })
        .catch((e) => {
          swal(
            "Internet Error",
            "Can't to load Projects Check Your Internet Or Reload This Page"
          );
          console.log(e);
          loader.classList.remove("loading");
        });
    }
  } else {
    swal("Portfolio Projects", "This is Latest Projects");
  }
}

async function loadSkills(num, label = "skills", noScroll = true) {
  let link =
      num.indexOf("http") != -1
        ? num
        : createUrl(num, MaxSKillsResult, label, "currSkillsIndex"),
    postHtml = "",
    postShowElem = s("#skills");
  let currIndex = parseInt(localStorage.getItem("currSkillsIndex")),
    loader = document.body;

  if (link != undefined) {
    if (currIndex != num) {
      loader.classList.add("loading");
      fetch(link, {})
        .then((res) => res.json())
        .then((data) => {
          blogInfo = Object.assign(
            {
              [label]: {
                totalPosts: parseInt(data.feed.openSearch$totalResults.$t),
              },
            },
            blogInfo
          );
          currIndex = parseInt(localStorage.getItem("currSkillsIndex"));
          let posts = data.feed.entry;
          if (Array.isArray(posts)) {
            updateCurrIndex(num, label, MaxSKillsResult, "currSkillsIndex");
            for (let post of posts) {
              let summary = post.summary.$t,
                icon = summary
                  .slice(summary.search("icon:"))
                  .trim()
                  .split(",")[0]
                  .replace("icon:", "")
                  .trim(),
                color = summary
                  .slice(summary.search("color:"))
                  .trim()
                  .split(",")[0]
                  .replace("color:", "")
                  .trim(),
                skillInfo = summary.slice(summary.search("text:"));
              skillInfo = skillInfo.split(",")[0].replace("text:", "").trim();
              postHtml += `
                <div class="skill-card">
                  <div class="skill-ico">
                    <i style="color: ${color}" class="fa-brands ${icon}"></i>
                  </div>
                  <h4 class="skill-name">${post.title.$t}</h4>
                  <p class="skill-info">
                    ${skillInfo}
                  </p>
              </div>
              `;
            }
            postShowElem.insertAdjacentHTML("beforeEnd", postHtml);
            if (!noScroll) {
              postShowElem.scrollIntoView();
            }
            creteLoadMore(
              "#skills-pagenation",
              MaxSKillsResult,
              "loadSkills",
              "currSkillsIndex",
              "skills"
            );
            loader.classList.remove("loading");
          } else {
            swal("Portfolio Skills", "I work to improve My Skills Now...");
            loader.classList.remove("loading");
          }
        })
        .catch((e) => {
          swal(
            "Internet Error",
            "Can't to load Skills Check Your Internet Or Reload This Page"
          );
          loader.classList.remove("loading");
        });
    }
  } else {
    swal("Portfolio Skills", "I work to improve My Skills Now...");
    loader.classList.remove("loading");
  }
}

async function loadTimeLine(num, label = "timeline", noScroll = true) {
  let link =
      num.indexOf("http") != -1
        ? num
        : createUrl(num, MaxTimeLinesResult, label, "currTimeLineIndex"),
    postHtml = "",
    postShowElem = s("#timeline");
  let currIndex = parseInt(localStorage.getItem("currTimeLineIndex")),
    loader = document.body;

  if (link != undefined) {
    if (currIndex != num) {
      loader.classList.add("loading");
      await fetch(link, {})
        .then((res) => res.json())
        .then((data) => {
          blogInfo = Object.assign(
            {
              [label]: {
                totalPosts: parseInt(data.feed.openSearch$totalResults.$t),
              },
            },
            blogInfo
          );

          currIndex = parseInt(localStorage.getItem("currTimeLineIndex"));
          let posts = data.feed.entry;
          if (Array.isArray(posts)) {
            updateCurrIndex(
              num,
              label,
              MaxTimeLinesResult,
              "currTimeLineIndex"
            );

            for (let post of posts) {
              let summary = post.summary.$t,
                icon = summary
                  .slice(summary.search("icon:"))
                  .trim()
                  .split(",")[0]
                  .replace("icon:", "")
                  .trim(),
                date = summary
                  .slice(summary.search("date:"))
                  .trim()
                  .split(",")[0]
                  .replace("date:", "")
                  .trim()
                  .split("-"),
                timelineInfo = summary.slice(summary.search("text:")),
                title = post.title.$t.split("-");
              timelineInfo = timelineInfo
                .split(",")[0]
                .replace("text:", "")
                .trim();
              postHtml += `
                <div class="timeline-card">
                  <div class="timeline-icon">
                    <i class="${icon}"></i>
                  </div>
                  <div class="timeline-date">${date[0]}  <span>${
                date[1] != undefined ? "-" + date[1] : ""
              }</span></div>
                  <h5 class="timeline-title">
                    ${title[0]} <span>${
                title[1] != undefined ? "-" + title[1] : ""
              }</span>
                  </h5>
                  <p class="timeline-info">
                  ${timelineInfo}
                  </p>
                </div>
              `;
            }
            postShowElem.insertAdjacentHTML("beforeEnd", postHtml);
            if (!noScroll) {
              postShowElem.scrollIntoView();
            }
            creteLoadMore(
              "#timeline-pagenation",
              MaxTimeLinesResult,
              "loadTimeLine",
              "currTimeLineIndex",
              "timeline"
            );
            loader.classList.remove("loading");
          } else {
            loader.classList.remove("loading");
            swal("Portfolio TimeLine", "This Is latest Activity In My Life");
          }

          return data;
        })
        .catch((e) => {
          swal(
            "Internet Error",
            "Can't to load TimeLine Check Your Internet Or Reload This Page"
          );
          console.log(e);
          loader.classList.remove("loading");
        });
    }
  } else {
    loader.classList.remove("loading");
    swal("Portfolio Projects", "This Is latest Activity In My Life");
  }
}

/*jshint esversion:6 */

let hash = window.location.hash;
let scrollHeight = document.documentElement.scrollHeight;
let loaded = false;
/**
 * load links From DataBase js file
 *
 * @param {Number} start
 * @param {Number} end
 * @param {Array} skills
 */
function loadLinks(links) {
  let renderHtml = "";

  for (let i = 0; i < links.length; i++) {
    let html = `
            <a onclick="swapBetweenSection(this)" href="${
              links[i].path
            }" class="link-anc ${
      hash == links[i].path ? "active" : ""
    }" title="${links[i].name}">
              <span class='material-icons'>${links[i].icon}</span>
            </a>
          `;
    renderHtml += html;
  }
  return renderHtml;
}

// /**
//  * lazy load section context
//  *
//  *
//  * @param {Element} sec
//  * @param {String} ctx
//  */
// function loadSection(sec, ctx) {

// }

/**
 * swap Section effect on click navigation icon
 * @param {Element} ele
 */
function swapBetweenSection(ele) {
  let sec = s(ele.getAttribute("href"));
  ele.addClass("active").siblings().removeClass("active");
  sec.addClass("active").siblings().removeClass("active");
}

function loadActive() {
  let urlHash = window.location.hash,
    link = s(`[href="${urlHash != "" ? urlHash : "#home"}"]`);
  link.click();
  loadSectionContent(s(urlHash));
}

function nextSection() {
  link = s(`[href="${hash != "" ? hash : "#home"}"]`);
  link.nextElementSibling?.click();
  hash = window.location.hash;
}

function PrevSection() {
  let urlHash = window.location.hash,
    link = s(`[href="${hash != "" ? hash : "#home"}"]`);
  link.previousElementSibling?.click();
}

window.addEventListener("load", function () {
  document.body.insertAdjacentHTML(
    "beforeend",
    `    <div class="navigation">
    <div class="navigation-links">
    ${loadLinks(metaData.links)}
    </div>
    </div>`
  );
  loadActive();
  document.body.classList.remove("loading");
  console.log(getDeviceType());
  if (getDeviceType() == "desktop")
    window.addEventListener("scroll", changeOnScroll);
});

/**
 *
 * @param {Element} sec
 */

function loadAbout() {
  loadSkills(createUrl(1, MaxSKillsResult, "skills", "currSkillsIndex"));
  loadTimeLine(
    createUrl(1, MaxTimeLinesResult, "timeline", "currTimeLineIndex")
  );
}

function loadProjects() {
  loadPosts(createUrl(1, MaxResult, "projects", "currIndex"));
}

/**
 *
 * @param {Element} sec
 */

function loadSectionContent(sec) {
  document.body.classList.add("loading");
  let loaded = sec.getAttribute("data-loaded") ?? "true";
  loaded = loaded == "false" ? false : true;
  if (!loaded) {
    let funcToLoad = sec.getAttribute("data-load").split(",");
    for (func of funcToLoad) {
      window[func]();
    }
    sec.setAttribute("data-loaded", "true");
  }
}

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};

let changeOnScroll = () => {
  //let hash = window.location.hash;
  let currSec = s(hash),
    scrollHeight =
      Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.offsetHeight,
        document.body.clientHeight,
        document.documentElement.clientHeight
      ) - document.scrollingElement.clientHeight;
  if (scrollY >= scrollHeight && !(scrollHeight <= 0)) {
    let nextElem = currSec.nextElementSibling;
    if (nextElem) {
      window.location.hash = nextElem.id;
      hash = "#" + nextElem.id;
    }
    console.log(nextElem, currSec, hash, scrollHeight, scrollY);
  } else if (scrollHeight > 0 && scrollY <= 0) {
    let nextElem = currSec.previousElementSibling;

    if (nextElem) {
      window.location.hash = nextElem.id;
      hash = "#" + nextElem.id;
    }
  }
};

window.onhashchange = function (e) {
  loadActive();
  loadSectionContent(s(window.location.hash));
  document.body.classList.remove("loading");
};

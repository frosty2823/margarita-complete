window.addEventListener("load", function () {
  const buttons = document.querySelectorAll(".airDelva");
  const personalNote = document.querySelector("#personalNote");
  const successLabel = document.querySelector("#clipped");
  const sliderBtn = document.querySelector("#checkBox");
  const languageSelect = document.querySelector(".language-select");

  let varNameOne = "";
  chrome.storage.sync.get(
    {
      varNameOne: "", // if there isn't any data,
    },
    function (items) {
      varNameOne = items.varNameOne;
      if (varNameOne) {
        chrome.storage.sync.set({
          varNameOne: sliderBtn.checked,
        });
        sliderBtn.click();
        languageSelect.textContent = "French";
        let frenchWords = [
          "Lead ",
          "Lead Reference",
          "Lead Suivi",
          "Reference",
          "Infolettre",
          "Negatif",
        ];
        let i = 0;
        buttons.forEach((btn) => {
          btn.innerText = frenchWords[i];
          i = i + 1;
        });
      } else {
        languageSelect.textContent = "English";
        chrome.storage.sync.set({
          varNameOne: sliderBtn.checked,
        });
        let englishWords = [
          "Lead",
          "Lead Reference",
          "Lead Follow-up",
          "Referral",
          "Newsletter",
          "Negative",
        ];
        let i = 0;
        buttons.forEach((btn) => {
          btn.innerText = englishWords[i];
          i = i + 1;
        });
      }
    }
  );

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      runCopyFunction(button.textContent, personalNote.value, successLabel);
    });
  });

  sliderBtn.addEventListener("click", function () {
    if (sliderBtn.checked) {
      chrome.storage.sync.set({
        varNameOne: sliderBtn.checked,
      });
      languageSelect.textContent = "French";
      let frenchWords = [
        "Lead",
        "Lead Reference",
        "Lead Suivi",
        "Reference",
        "Infolettre",
        "Negatif",
      ];
      let i = 0;
      buttons.forEach((btn) => {
        btn.innerText = frenchWords[i];
        i = i + 1;
      });
    } else {
      languageSelect.textContent = "English";
      chrome.storage.sync.set({
        varNameOne: sliderBtn.checked,
      });
      let englishWords = [
        "Lead",
        "Lead Reference",
        "Lead Follow-up",
        "Referral",
        "Newsletter",
        "Negative",
      ];
      let i = 0;
      buttons.forEach((btn) => {
        btn.innerText = englishWords[i];
        i = i + 1;
      });
    }
  });
});

async function runCopyFunction(buttonText, personalNote, successLabel) {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  let nextTab;
  chrome.scripting.executeScript(
    {
      target: { tabId: tab.id },
      function: copyToClickBoard,
      args: [buttonText, personalNote],
    },
    (result) => {
      console.log(result);
      successLabel.innerText = result[0].result;
      setTimeout(function () {
        successLabel.innerText = " ";
      }, 2000);
    }
  );

  // Switching the Tabs
  chrome.tabs.query({ currentWindow: true }, (tabsArray) => {
    // If only 1 tab is present, do nothing.
    if (tabsArray.length === 1) return;

    // Otherwise switch to the next available tab.
    // Find index of the currently active tab.
    let activeTabIndex = null;
    tabsArray.forEach((tab, index) => {
      if (tab.active === true) {
        activeTabIndex = index;
      }
    });

    // Obtain the next tab. If the current active
    // tab is the last tab, the next tab should be
    // the first tab.
    let tabUrl = "";
    for (let i = 0; i < tabsArray.length; i++) {
      let checkTab = tabsArray[(activeTabIndex + (i + 1)) % tabsArray.length];
      tabUrl = checkTab.url;
      if (tabUrl.includes("airtable")) {
        nextTab = tabsArray[(activeTabIndex + (i + 1)) % tabsArray.length];
        break;
      } else if (tabUrl.includes("spreadsheet")) {
        nextTab = tabsArray[(activeTabIndex + (i + 1)) % tabsArray.length];
        break;
      }
    }

    // Switch to the next tab.
    if (tabUrl.includes("airtable")) {
      chrome.scripting.executeScript({
        target: { tabId: nextTab.id },
        function: runAirTable,
      });
    } else if (tabUrl.includes("spreadsheet")) {
      chrome.scripting.executeScript({
        target: { tabId: nextTab.id },
        function: runGoogleSheet,
      });
    }

    chrome.tabs.update(nextTab.id, { active: true });
  });
}

const runAirTable = function () {
  setTimeout(function () {
    if (
      document.querySelector(
        ".dataRow.leftPane.rowExpansionEnabled.rowSelectionEnabled.cursorCell"
      ) != null
    ) {
      document
        .querySelector(".dataRow.ghost.leftPane.rowInsertionEnabled")
        .click();
      document
        .querySelector(".dataRow.ghost.leftPane.rowInsertionEnabled")
        .click();
      setTimeout(function () {
        document.execCommand("paste");
      }, 1000);
    } else {
      document
        .querySelector(".dataRow.ghost.leftPane.rowInsertionEnabled")
        .click();

      setTimeout(function () {
        document.execCommand("paste");
      }, 1000);
    }
  }, 2000);
};

const runGoogleSheet = function () {
  setTimeout(function () {
    document
      .querySelectorAll(".goog-inline-block.grid4-inner-container")[1]
      .focus();
    setTimeout(function () {
      let evt = new CustomEvent("keydown");
      evt.which = 13;
      evt.keyCode = 13;
      let var1 = document.querySelector(".jfk-textinput.waffle-name-box");
      let var2 = document.querySelector(".cell-input");
      for (let i = 1; i <= 1000; i++) {
        var1.value = `A${i}`;
        const ke = new KeyboardEvent("keydown", {
          bubbles: true,
          cancelable: true,
          keyCode: 13,
        });
        var1.dispatchEvent(ke);
        let var3 = var2.textContent;
        if (var3.length == 0) {
          break;
        }
        console.log(var3.length);
      }
      setTimeout(function () {
        document.execCommand("paste");
      }, 1000);
    }, 1000);
  }, 2000);
};

const copyToClickBoard = function (buttonText, personalNote) {
  // let date = document.querySelector(".g3").getAttribute("title");
  // const email = document.querySelector(".gD").getAttribute("email");
  let spanishMonths = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sept",
    "oct",
    "nov",
    "dic",
  ];

  let frenchMonths = [
    "janv.",
    "févr.",
    "mars. ",
    "avr.",
    "mai.",
    "juin.",
    "juil.",
    "août.",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];

  let EnglishMonths = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];
  if (document.querySelector(".adx")) {
    document.querySelector(".adx").click();
  }
  const arr = document.querySelectorAll(".a3s.aiL");
  let ar = document.querySelector(".nH.aHU").children[0].children[2].children;
  let current = 0;
  for (let i = 0; i < ar.length; i++) {
    let a = ar[i];
    if (a.ariaExpanded == "true") {
      current = i;
      break;
    }
  }
  let email = "";
  let fullName = "";
  let date = "";
  let lastEmailContent = "";
  let newEmail = "";
  let breakThis = 0;
  let generateEmailList = ar[current].children[0].children[0].querySelectorAll(
    "[data-hovercard-id]"
  );
  let validEmail = generateEmailList.forEach(function (checkThis) {
    if (checkThis.getAttribute("email") != null && breakThis != 1) {
      newEmail = checkThis.getAttribute("email");
      breakThis = 1;
    }
  });
  email = newEmail;
  const domainName = email.split("@").pop();
  let newName = "";
  let breakThisForName = 0;
  let generateNameList = ar[current].children[0].children[0].querySelectorAll(
    "[data-hovercard-id]"
  );
  let validName = generateNameList.forEach(function (checkThis) {
    if (
      !(
        checkThis.getAttribute("name").includes(":") &&
        checkThis.getAttribute("name").length <= 4
      ) &&
      breakThisForName != 1 &&
      !checkThis.getAttribute("name").includes("undefined")
    ) {
      console.log(checkThis.getAttribute("name"));
      newName = checkThis.getAttribute("name");
      breakThisForName = 1;
    }
  });
  fullName = newName;
  if (current == ar.length - 1) {
    lastEmailContent = arr[arr.length - 2].innerText.split("\n").join(" ");
    lastEmailContent = lastEmailContent.split("\t").join(" ");
    date = ar[ar.length - 1].innerText.split("\n")[1];
  } else {
    let notLast1 = document
      .querySelector(".nH.hx")
      .children[2].children[current].innerText.split("\n");
    if (
      notLast1.includes("Translate message") &&
      !notLast1.join("").includes("Save email as template")
    ) {
      let checkthisNow = notLast1.indexOf("Translate message") + 1;
      for (let i = 0; i <= checkthisNow; i++) {
        delete notLast1[i];
      }
      lastEmailContent = notLast1.join("");
    }
    if (notLast1.join("").includes("Save email as template")) {
      const newArray = notLast1.join(" ");
      let checkthisNow = newArray.substring(
        newArray.indexOf("Save email as template")
      );
      lastEmailContent = checkthisNow
        .replace("Save email as template", "")
        .split("\t")
        .join(" ");
    } else if (notLast1[3].includes("me")) {
      delete notLast1[0];
      delete notLast1[1];
      delete notLast1[2];
      delete notLast1[3];
      delete notLast1[4];
      lastEmailContent = notLast1.join("");
    } else {
      delete notLast1[0];
      delete notLast1[1];
      delete notLast1[2];
      delete notLast1[3];
      lastEmailContent = notLast1.join("");
    }
    date = ar[current].innerText.split("\n")[1];
  }
  const conversationURL = document.location.href;
  let newDD = "";
  let month = "";
  let y3 = "";
  // For spanish, it starts right after English
  if (
    date.includes("minutes") ||
    date.includes("seconds") ||
    date.includes("hours") ||
    date.includes("minute") ||
    date.includes("second") ||
    date.includes("hour") ||
    !(
      date.includes("Jan") ||
      date.includes("Feb") ||
      date.includes("March") ||
      date.includes("April") ||
      date.includes("May") ||
      date.includes("June") ||
      date.includes("July") ||
      date.includes("Aug") ||
      date.includes("Sept") ||
      date.includes("Oct") ||
      date.includes("Nov") ||
      date.includes("Dec") ||
      date.includes("ene") ||
      date.includes("feb") ||
      date.includes("mar") ||
      date.includes("abr") ||
      date.includes("may") ||
      date.includes("jun") ||
      date.includes("jul") ||
      date.includes("ago") ||
      date.includes("sept") ||
      date.includes("oct") ||
      date.includes("nov") ||
      date.includes("dic") ||
      date.includes("janv.") ||
      date.includes("vr.") ||
      date.includes("mars.") ||
      date.includes("avr.") ||
      date.includes("mai.") ||
      date.includes("juin.") ||
      date.includes("juil.") ||
      date.includes("ao.") ||
      date.includes("sept.") ||
      date.includes("oct.") ||
      date.includes("nov.") ||
      date.includes("c.")
    )
  ) {
    console.log(date.includes("d"), date);
    date = new Date();
    newDD = date.getDate();
    month = date.getMonth() + 1;
    y3 = date.getFullYear();
  } else {
    // Creating the textfield from where we will execute the copy commmand
    // After English, Spanish days are written
    if (
      !(
        date.includes("Mon") ||
        date.includes("Tue") ||
        date.includes("Wed") ||
        date.includes("Thu") ||
        date.includes("Fri") ||
        date.includes("Sat") ||
        date.includes("Sun") ||
        date.includes("lun") ||
        date.includes("mar") ||
        date.includes("mi") ||
        date.includes("jue") ||
        date.includes("vie") ||
        date.includes("b") ||
        date.includes("dom") ||
        date.includes("lun") ||
        date.includes("mar") ||
        date.includes("mer") ||
        date.includes("jeu") ||
        date.includes("ven") ||
        date.includes("sam") ||
        date.includes("dim")
      )
    ) {
      let dateArray = date.split(" ");
      let y1 = dateArray[2].split("");
      y3 = y1[0] + y1[1] + y1[2] + y1[3];
      console.log("Executing", y3, dateArray, y1);
      month = 0;
      if (!EnglishMonths.includes(dateArray[0])) {
        newDD = dateArray[0];
        dateArray[0] = dateArray[1];
      } else {
        let newD = dateArray[1].split(",");
        newDD = newD[0];
      }
      if (dateArray[0] == "Jan") month = 1;
      else if (dateArray[0] == "Feb") month = 2;
      else if (dateArray[0] == "March") month = 3;
      else if (dateArray[0] == "April") month = 4;
      else if (dateArray[0] == "May") month = 5;
      else if (dateArray[0] == "June") month = 6;
      else if (dateArray[0] == "July") month = 7;
      else if (dateArray[0] == "Aug") month = 8;
      else if (dateArray[0] == "Sep") month = 9;
      else if (dateArray[0] == "Oct") month = 10;
      else if (dateArray[0] == "Nov") month = 11;
      else if (dateArray[0] == "Dec") month = 12;
      else if (dateArray[0] == "ene") month = 1;
      else if (dateArray[0] == "feb") month = 2;
      else if (dateArray[0] == "mar") month = 3;
      else if (dateArray[0] == "abr") month = 4;
      else if (dateArray[0] == "may") month = 5;
      else if (dateArray[0] == "jun") month = 6;
      else if (dateArray[0] == "jul") month = 7;
      else if (dateArray[0] == "ago") month = 8;
      else if (dateArray[0] == "sept") month = 9;
      else if (dateArray[0] == "oct") month = 10;
      else if (dateArray[0] == "nov") month = 11;
      else if (dateArray[0] == "dic") month = 12;
      else if (dateArray[0] == "janv.") month = 1;
      else if (dateArray[0].includes("vr.")) month = 2;
      else if (dateArray[0] == "mars.") month = 3;
      else if (dateArray[0] == "avr.") month = 4;
      else if (dateArray[0] == "mai.") month = 5;
      else if (dateArray[0] == "juin.") month = 6;
      else if (dateArray[0] == "juil.") month = 7;
      else if (dateArray[0].includes("ao")) month = 8;
      else if (dateArray[0] == "sept.") month = 9;
      else if (dateArray[0] == "oct.") month = 10;
      else if (dateArray[0] == "nov.") month = 11;
      else if (dateArray[0].includes("c.")) month = 12;
    } else {
      console.log(date);
      let dateArray = "";
      if (
        !(
          date.includes("Jan") ||
          date.includes("Feb") ||
          date.includes("March") ||
          date.includes("April") ||
          date.includes("May") ||
          date.includes("June") ||
          date.includes("July") ||
          date.includes("Aug") ||
          date.includes("Sept") ||
          date.includes("Oct") ||
          date.includes("Nov") ||
          date.includes("Dec") ||
          date.includes("ene") ||
          date.includes("feb") ||
          date.includes("mar") ||
          date.includes("abr") ||
          date.includes("may") ||
          date.includes("jun") ||
          date.includes("jul") ||
          date.includes("ago") ||
          date.includes("sept") ||
          date.includes("oct") ||
          date.includes("nov") ||
          date.includes("dic")
        )
      )
        dateArray = date.split(".");
      else dateArray = date.split(",");
      let previousDay = dateArray[dateArray.length - 2].split(" ");
      month = 0;

      if (!EnglishMonths.includes(previousDay[1])) {
        newDD = previousDay[previousDay.length - 2];
        month = previousDay[previousDay.length - 1];
      } else {
        newDD = previousDay[previousDay.length - 1];
        month = previousDay[previousDay.length - 2];
      }

      let y2 = new Date();
      y3 = y2.getFullYear();
      if (month == "Jan") month = 1;
      else if (month == "Feb") month = 2;
      else if (month == "March") month = 3;
      else if (month == "April") month = 4;
      else if (month == "May") month = 5;
      else if (month == "June") month = 6;
      else if (month == "July") month = 7;
      else if (month == "Aug") month = 8;
      else if (month == "Sep") month = 9;
      else if (month == "Oct") month = 10;
      else if (month == "Nov") month = 11;
      else if (month == "Dec") month = 12;
      else if (month == "ene") month = 1;
      else if (month == "feb") month = 2;
      else if (month == "mar") month = 3;
      else if (month == "abr") month = 4;
      else if (month == "may") month = 5;
      else if (month == "jun") month = 6;
      else if (month == "jul") month = 7;
      else if (month == "ago") month = 8;
      else if (month == "sept") month = 9;
      else if (month == "oct") month = 10;
      else if (month == "nov") month = 11;
      else if (month == "dic") month = 12;
      else if (month == "janv.") month = 1;
      else if (month.includes("vr")) month = 2;
      else if (month == "mars") month = 3;
      else if (month == "avr") month = 4;
      else if (month == "mai") month = 5;
      else if (month == "juin") month = 6;
      else if (month == "juil") month = 7;
      else if (month.includes("t")) month = 8;
      else if (month == "sept") month = 9;
      else if (month == "oct") month = 10;
      else if (month == "nov") month = 11;
      else if (month.includes("c")) month = 12;
    }
  }
  date = `${month}/${newDD}/${y3}`;
  var textArea = document.createElement("textarea");
  textArea.value =
    fullName +
    "\t" +
    date +
    "\t" +
    domainName +
    "\t" +
    email +
    "\t" +
    buttonText +
    "\t" +
    lastEmailContent +
    "\t" +
    personalNote +
    "\t" +
    conversationURL;
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "Clipped" : "Not Clipped";
    return msg;
  } catch (err) {
    console.error("Error");
  }

  document.body.removeChild(textArea);
};

// Keydown Event
// Press Event

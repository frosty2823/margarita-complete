window.addEventListener("load", function () {
  const buttons = document.querySelectorAll(".margarita");
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
          "Prospect",
          "Lead",
          "Reference",
          "Infolettre",
          "Negatif",
          "Contacter plus tard",
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
          "Prospect",
          "Lead",
          "Referral",
          "Newsletter",
          "Negative",
          "Contact Later",
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
        "Prospect",
        "Lead",
        "Reference",
        "Infolettre",
        "Negatif",
        "Contacter plus tard",
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
        "Prospect",
        "Lead",
        "Referral",
        "Newsletter",
        "Negative",
        "Contact Later",
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
    document.querySelectorAll(".rowNumber")[1].click();
    document.querySelectorAll(".rowNumber")[1].focus();
    setTimeout(function () {
      document.execCommand("paste");
    }, 1000);
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
  let date = document.querySelector(".g3").getAttribute("title");
  const fullName = document.querySelector(".gD").getAttribute("name");
  const email = document.querySelector(".gD").getAttribute("email");
  const domainName = email.split("@").pop();
  const arr = document.querySelectorAll(".a3s.aiL");
  let lastEmailContent = arr[0].innerText.split("\n").join(" ");
  lastEmailContent = lastEmailContent.split("\t").join(" ");
  const conversationURL = document.location.href;
  // Creating the textfield from where we will execute the copy commmand
  var textArea = document.createElement("textarea");
  let dateArray = date.split(" ");
  let y1 = dateArray[2].split("");
  let y3 = y1[0] + y1[1] + y1[2] + y1[3];
  let month = 0;
  let newD = dateArray[1].split("");
  let newDD = newD[0] + newD[1];
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
  date = `${month}/${newDD}/${y3}`;
  console.log(date);
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

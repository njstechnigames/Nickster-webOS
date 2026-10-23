// Live Clock
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeText = document.querySelector("#timeElement");
    if (timeText) timeText.innerHTML = currentTime;
}
setInterval(updateTime, 1000);
updateTime();

let highestZIndex = 10;

// Dynamic Taskbar
function updateTaskbar() {
    const container = document.getElementById("openAppsContainer");
    if (!container) return;
    container.innerHTML = "";

    const allWindows = document.querySelectorAll(".window");
    allWindows.forEach(win => {
        if (win.style.display !== "none" || win.dataset.opened === "true") {
            const title = win.getAttribute("data-title") || win.id;
            const btn = document.createElement("button");
            btn.textContent = title;
            
            const isHidden = (win.style.display === "none");
            
            if (isHidden) {
                btn.style.cssText = "background: rgba(0,0,0,0.3); color: #00ff66; border: 1px dashed #00ff66; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 12px; opacity: 0.7; flex-shrink: 0;";
            } else {
                btn.style.cssText = "background: rgba(0,0,0,0.6); color: #00ff66; border: 1px solid #00ff66; border-radius: 4px; padding: 2px 8px; cursor: pointer; font-size: 12px; flex-shrink: 0;";
            }
            
            btn.addEventListener("click", () => {
                if (win.style.display === "none") {
                    win.style.display = "block";
                    win.style.zIndex = ++highestZIndex;
                } else {
                    win.style.display = "none";
                }
                updateTaskbar();
            });
            
            container.appendChild(btn);
        }
    });
}

function openWindow(element) {
    if (!element) return;
    element.style.display = "block";
    element.dataset.opened = "true";
    element.style.zIndex = ++highestZIndex;
    updateTaskbar();
}

function closeWindow(element) {
    if (!element) return;
    element.style.display = "none";
    element.dataset.opened = "false";
    updateTaskbar();
}

// Draggable Window Handler
function dragElement(element) {
  var initialX = 0, initialY = 0, currentX = 0, currentY = 0;
  var header = document.getElementById(element.id + "header") || element.querySelector(".windowheader");

  if (header) {
    header.onmousedown = startDragging;
  } else {
    element.onmousedown = startDragging;
  }

  function startDragging(e) {
    if (element.dataset.maximized === "true") return;
    e = e || window.event;
    e.preventDefault();
    initialX = e.clientX;
    initialY = e.clientY;
    document.onmouseup = stopDragging;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    currentX = initialX - e.clientX;
    currentY = initialY - e.clientY;
    initialX = e.clientX;
    initialY = e.clientY;
    element.style.top = (element.offsetTop - currentY) + "px";
    element.style.left = (element.offsetLeft - currentX) + "px";
  }

  function stopDragging() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

// Initialize windows & startup popup
document.querySelectorAll(".window").forEach(win => {
    dragElement(win);
    win.addEventListener("mousedown", () => {
        win.style.zIndex = ++highestZIndex;
    });

    const minBtn = win.querySelector(".min-btn");
    if (minBtn) {
        minBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            win.style.display = "none";
            updateTaskbar();
        });
    }

    const maxBtn = win.querySelector(".max-btn");
    if (maxBtn) {
        maxBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (win.dataset.maximized === "true") {
                win.style.top = win.dataset.prevTop;
                win.style.left = win.dataset.prevLeft;
                win.style.width = win.dataset.prevWidth;
                win.style.height = win.dataset.prevHeight;
                win.style.transform = "translate(-50%, -50%)";
                win.dataset.maximized = "false";
            } else {
                win.dataset.prevTop = win.style.top;
                win.dataset.prevLeft = win.style.left;
                win.dataset.prevWidth = win.style.width;
                win.dataset.prevHeight = win.style.height;
                win.style.top = "40px";
                win.style.left = "0";
                win.style.transform = "none";
                win.style.width = "100vw";
                win.style.height = "calc(100vh - 40px)";
                win.dataset.maximized = "true";
            }
        });
    }
});

// Make startup popup draggable and closeable
const welcomePopup = document.getElementById("welcome-popup");
if (welcomePopup) {
    dragElement(welcomePopup);
}
const welcomeClose = document.getElementById("welcomeclose");
if (welcomeClose && welcomePopup) {
    welcomeClose.addEventListener("click", () => {
        welcomePopup.style.display = "none";
    });
}

// App Elements & References
const settingsScreen = document.getElementById("settings");
const userguideScreen = document.getElementById("userguide");
const notesScreen = document.getElementById("notes");
const storeScreen = document.getElementById("store");
const terminalScreen = document.getElementById("terminal");
const chromeScreen = document.getElementById("chrome");

// Desktop Icon Double-Click Bindings
const settingsIcon = document.getElementById("settings-icon");
const userguideIcon = document.getElementById("userguide-icon");
const notesIcon = document.getElementById("notes-icon");
const storeIcon = document.getElementById("store-icon");
const terminalIcon = document.getElementById("terminal-icon");
const chromeIcon = document.getElementById("chrome-icon");

if (settingsIcon) settingsIcon.addEventListener("dblclick", () => openWindow(settingsScreen));
if (userguideIcon) userguideIcon.addEventListener("dblclick", () => openWindow(userguideScreen));
if (notesIcon) notesIcon.addEventListener("dblclick", () => openWindow(notesScreen));
if (storeIcon) storeIcon.addEventListener("dblclick", () => openWindow(storeScreen));
if (terminalIcon) terminalIcon.addEventListener("dblclick", () => openWindow(terminalScreen));
if (chromeIcon) chromeIcon.addEventListener("dblclick", () => openWindow(chromeScreen));

// Close Button Bindings
const settingsClose = document.getElementById("settingsclose");
const userguideClose = document.getElementById("userguideclose");
const closeWindowNotes = document.getElementById("closewindow");
const closeWindowStore = document.getElementById("closewindow2");
const terminalClose = document.getElementById("terminalclose");
const chromeClose = document.getElementById("chromeclose");

if (settingsClose) settingsClose.addEventListener("click", () => closeWindow(settingsScreen));
if (userguideClose) userguideClose.addEventListener("click", () => closeWindow(userguideScreen));
if (closeWindowNotes) closeWindowNotes.addEventListener("click", () => closeWindow(notesScreen));
if (closeWindowStore) closeWindowStore.addEventListener("click", () => closeWindow(storeScreen));
if (terminalClose) terminalClose.addEventListener("click", () => closeWindow(terminalScreen));
if (chromeClose) chromeClose.addEventListener("click", () => closeWindow(chromeScreen));

// Settings Features Logic (Clickable Backgrounds & Mode Toggle)
const osBody = document.getElementById("os-body");
const topTaskbar = document.getElementById("topTaskbar");
const modeToggleBtn = document.getElementById("mode-toggle-btn");

let isDarkMode = true;

document.querySelectorAll(".bg-option-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        let selectedBg = btn.getAttribute("data-bg");
        if (selectedBg && osBody) {
            osBody.style.backgroundImage = `url('./${selectedBg}')`;
        }
    });
});

if (modeToggleBtn && topTaskbar) {
    modeToggleBtn.addEventListener("click", () => {
        isDarkMode = !isDarkMode;
        if (isDarkMode) {
            topTaskbar.style.backgroundColor = "rgba(6, 209, 169, 0.35)";
            topTaskbar.style.color = "#000000";
        } else {
            topTaskbar.style.backgroundColor = "rgba(255, 255, 255, 0.85)";
            topTaskbar.style.color = "#000000";
        }
    });
}

// Chrome Navigation Controls
const chromeUrl = document.getElementById("chrome-url");
const chromeGo = document.getElementById("chrome-go");
const chromeFrame = document.getElementById("chrome-frame");
const chromeHome = document.getElementById("chrome-home");

function navigateChrome() {
    let inputVal = chromeUrl.value.trim();
    if (!inputVal) return;

    let targetUrl = "";
    if (inputVal.startsWith("http://") || inputVal.startsWith("https://")) {
        targetUrl = inputVal;
    } else if (inputVal.includes(".") && !inputVal.includes(" ")) {
        targetUrl = "https://" + inputVal;
    } else {
        targetUrl = "https://www.bing.com/search?q=" + encodeURIComponent(inputVal);
    }

    chromeUrl.value = targetUrl;
    chromeFrame.src = targetUrl;
}

if (chromeGo) chromeGo.addEventListener("click", navigateChrome);
if (chromeUrl) {
    chromeUrl.addEventListener("keydown", (event) => {
        if (event.key === "Enter") navigateChrome();
    });
}
if (chromeHome) {
    chromeHome.addEventListener("click", () => {
        chromeUrl.value = "https://www.bing.com";
        chromeFrame.src = "https://www.bing.com";
    });
}

// Terminal Commands Logic
const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

if (terminalInput) {
    terminalInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            let command = terminalInput.value.trim();
            terminalOutput.innerHTML += `user@NicksterOS:~$ ${command}<br>`;
            
            if (command === "help") {
                terminalOutput.innerHTML += `Available commands: clear, help, date, echo [text], exit, whoami, version, about, sudo (not available)<br>`;
            } else if (command === "clear") {
                terminalOutput.innerHTML = "";
            }else if (command === "exit") {
                closeWindow(terminalScreen);
            }else if (command === "whoami") {
                terminalOutput.innerHTML += `You are a user of NicksterOS!<br>`;
            }else if (command === "version") {
                terminalOutput.innerHTML += `NicksterOS Version 1.3.1<br>`;
            }else if (command === "about") {
                terminalOutput.innerHTML += `NicksterOS is a web-based operating system created by NJ's TechniGames. It features a desktop environment, start menu, and various applications.<br>`;
            }else if (command === "sudo") {
                terminalOutput.innerHTML += `Sudo command is not available on this system.<br>`;
            } else if (command === "date") {
                terminalOutput.innerHTML += `${new Date()}<br>`;
            } else if (command.startsWith("echo ")) {
                terminalOutput.innerHTML += `${command.slice(5)}<br>`;
            } else if (command !== "") {
                terminalOutput.innerHTML += `Command not found: ${command}<br>`;
            }
            
            terminalInput.value = "";
            terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
    });
}

// Start Menu Toggle & Bindings
const startBtn = document.getElementById("startBtn");
const startMenu = document.getElementById("startMenu");

if (startBtn && startMenu) {
    startBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        startMenu.style.display = (startMenu.style.display === "block") ? "none" : "block";
    });

    document.addEventListener("click", () => {
        startMenu.style.display = "none";
    });

    startMenu.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

const startSettings = document.getElementById("start-settings");
const startUserGuide = document.getElementById("start-userguide");
const startNotes = document.getElementById("start-notes");
const startStore = document.getElementById("start-store");
const startTerminal = document.getElementById("start-terminal");
const startChrome = document.getElementById("start-chrome");

if (startSettings) startSettings.addEventListener("click", () => { openWindow(settingsScreen); startMenu.style.display = "none"; });
if (startUserGuide) startUserGuide.addEventListener("click", () => { openWindow(userguideScreen); startMenu.style.display = "none"; });
if (startNotes) startNotes.addEventListener("click", () => { openWindow(notesScreen); startMenu.style.display = "none"; });
if (startStore) startStore.addEventListener("click", () => { openWindow(storeScreen); startMenu.style.display = "none"; });
if (startTerminal) startTerminal.addEventListener("click", () => { openWindow(terminalScreen); startMenu.style.display = "none"; });
if (startChrome) startChrome.addEventListener("click", () => { openWindow(chromeScreen); startMenu.style.display = "none"; });

updateTaskbar();
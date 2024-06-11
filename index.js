const { exec } = require('node:child_process');
const shell = require('shelljs');

let terrariaRunning = false;
let buffer = false;
const delayInSeconds = 2.5;

setInterval(() => {
    const splitLines = shell.exec(`powershell.exe get-process`).split("\n");

    buffer = terrariaRunning;
    let terrariaWasFound = false;

    for (let line = 0; line < splitLines.length; line++) {
        const splitWords = splitLines[line].split(" ");
        for (let word = 0; word < splitWords.length; word++) {
            if (splitWords[word].toLowerCase() === "terraria") {
                terrariaWasFound = true;
                console.log("Terraria was found")
            }
        }
    }

    if (terrariaWasFound) {
        terrariaRunning = true;
        console.log("Terraria is running")
    }
    else {
        terrariaRunning = false; 
        console.log("Terraria is not running")
    }

    if (buffer != terrariaRunning) {
        changeRefreshRate();
    }

}, delayInSeconds * 1000);

function changeRefreshRate() {
    if (terrariaRunning)
        exec('"./RefreshRateChanger.exe" 60');
    else
        exec('"./RefreshRateChanger.exe" 76');
}
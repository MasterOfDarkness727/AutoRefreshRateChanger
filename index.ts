import { getDisplayRefreshRate, setDisplayRefreshRate } from "./ffi";

let defaultHZ = 76;
let gamesRunning = false;
let games = (await Bun.file("./GameProcessList.txt").text()).toLowerCase().split("\n");

if (getDisplayRefreshRate() > 60) {
  defaultHZ = getDisplayRefreshRate();
}

console.log(`Current refresh rate: ${getDisplayRefreshRate()}`);
console.log(`List of games (process names): `)
for (let i = 0; i < games.length; i++) {
  console.log(games[i].toString().trim())
}

setInterval(async () => {
  const { stdout } = Bun.spawn([
    "powershell",
    'Get-Process | Select -ExpandProperty "Name"',
  ]);
  const lines = (await new Response(stdout).text()).toLowerCase().split("\n");

  gamesRunning = false;

  for (let processName = 0; processName < lines.length; processName++) {
    for (let gameIndex = 0; gameIndex < games.length; gameIndex++) {
      if (lines[processName].trim() === games[gameIndex].toString().trim()) {
        gamesRunning = true;
      }
    }
  }

  if (gamesRunning) console.log("Games Running");
  else console.log("Games not running");

  if (gamesRunning === true && getDisplayRefreshRate() != 60) {
    await setDisplayRefreshRate(60);
    console.log(`New refresh rate: ${getDisplayRefreshRate()}`);
  } else if (gamesRunning === false && getDisplayRefreshRate() != defaultHZ) {
    await setDisplayRefreshRate(defaultHZ);
    console.log(`New refresh rate: ${getDisplayRefreshRate()}`);
  }
}, 2500);

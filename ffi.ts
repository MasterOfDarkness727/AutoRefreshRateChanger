import { dlopen, suffix, FFIType } from "bun:ffi";

import DEVMODEA from "./devmode";

const ENUM_CURRENT_SETTINGS = -1;

const DISP_CHANGE_SUCCESSFUL = 0;
const DISP_CHANGE_RESTART = 1;
const DISP_CHANGE_FAILED = -1;
const DISP_CHANGE_BADMODE = -2;
const DISP_CHANGE_NOTUPDATED = -3;
const DISP_CHANGE_BADFLAGS = -4;
const DISP_CHANGE_BADPARAM = -5;
const DISP_CHANGE_BADDUALVIEW = -6;

const user32 = dlopen(`user32.${suffix}`, {
  EnumDisplaySettingsA: {
    args: [FFIType.pointer, FFIType.int, FFIType.pointer],
    returns: FFIType.bool,
  },
  ChangeDisplaySettingsExA: {
    args: [
      FFIType.pointer,
      FFIType.pointer,
      FFIType.pointer,
      FFIType.int,
      FFIType.pointer,
    ],
    returns: FFIType.int,
  },
});

export function getDisplayRefreshRate() {
  const devmode = new DEVMODEA();

  const result = user32.symbols.EnumDisplaySettingsA(
    null,
    ENUM_CURRENT_SETTINGS,
    devmode.ptr
  );

  if (!result) {
    throw new Error("Failed to retrieve display settings");
  }

  return devmode.displayFrequency;
}

export function setDisplayRefreshRate(refreshRate: number): boolean {
  const devmode = new DEVMODEA();

  const enumResult = user32.symbols.EnumDisplaySettingsA(
    null,
    ENUM_CURRENT_SETTINGS,
    devmode.ptr
  );

  if (!enumResult) {
    throw new Error("Failed to retrieve display settings");
  }

  devmode.displayFrequency = refreshRate;

  const changeResult = user32.symbols.ChangeDisplaySettingsExA(
    null,
    devmode.ptr,
    null,
    0,
    null
  );

  switch (changeResult) {
    case DISP_CHANGE_SUCCESSFUL:
      return true;
    case DISP_CHANGE_BADDUALVIEW:
      console.log(
        "The settings change was unsuccessful because the system is DualView capable"
      );
      break;
    case DISP_CHANGE_BADFLAGS:
      console.log("An invalid set of flags was passed in.");
      break;
    case DISP_CHANGE_BADMODE:
      console.log("The graphics mode is not supported.");
      break;
    case DISP_CHANGE_BADPARAM:
      console.log(
        "An invalid parameter was passed in. This can include an invalid flag or combination of flags."
      );
      break;
    case DISP_CHANGE_FAILED:
      console.log("The display driver failed the specified graphics mode.");
      break;
    case DISP_CHANGE_NOTUPDATED:
      console.log("Unable to write settings to the registry.");
      break;
    case DISP_CHANGE_RESTART:
      console.log(
        "The computer must be restarted for the graphics mode to work."
      );
      break;
    default:
      console.log(
        `Unknown result from ChangeDisplaySettingsEx: ${changeResult}`
      );
      break;
  }
  return false;
}

import { ptr, type Pointer } from "bun:ffi";

const DEVMODE_A_SIZE = 156;
const OFFSETS = {
  dmSize: 36,
  dmDisplayFrequency: 120,
};

export default class DEVMODEA {
  private buffer: DataView;
  public ptr: Pointer;

  constructor() {
    this.buffer = new DataView(new ArrayBuffer(DEVMODE_A_SIZE));
    this.ptr = ptr(this.buffer);
    this.size = DEVMODE_A_SIZE;
  }

  private get size(): number {
    return this.buffer.getUint16(OFFSETS.dmSize, true);
  }

  private set size(value) {
    this.buffer.setUint16(OFFSETS.dmSize, value, true);
  }

  public get displayFrequency() {
    return this.buffer.getUint32(OFFSETS.dmDisplayFrequency, true);
  }

  public set displayFrequency(value) {
    this.buffer.setUint32(OFFSETS.dmDisplayFrequency, value, true);
  }
}

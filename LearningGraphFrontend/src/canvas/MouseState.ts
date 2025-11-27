import { Coordinate } from "./GraphModel";

export type MouseButton = 0 | 1 | 2; // Left = 0, Middle = 1, Right = 2

export const MouseButtons = {
  Left: 0 as MouseButton,
  Middle: 1 as MouseButton,
  Right: 2 as MouseButton,
};

export class MouseState {
  leftDown = false;
  middleDown = false;
  rightDown = false;

  // Previous state for edge detection
  wasLeftDown = false;
  wasMiddleDown = false;
  wasRightDown = false;

  lastCoords = new Coordinate();
  lastDragCoords = new Coordinate(); // for calculating drag deltas

  wheelDelta = 0;

  updatePosition(x: number, y: number) {
    this.lastCoords.x = x;
    this.lastCoords.y = y;
  }

  setButtonDown(button: MouseButton, down: boolean) {
    switch (button) {
      case MouseButtons.Left: this.leftDown = down; break;
      case MouseButtons.Middle: this.middleDown = down; break;
      case MouseButtons.Right: this.rightDown = down; break;
    }
  }

  isDragging() {
    return this.leftDown || this.middleDown || this.rightDown;
  }
}
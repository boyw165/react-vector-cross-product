export default class Point {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
    this.isClosed = false;
  }

  /**
   * Comparison operator.
   */
  eq(pt) {
    return pt instanceof Point && pt.x === this.x && pt.y === this.y;
  }

  getDistance(fromPt) {
    return Math.sqrt(Math.pow(fromPt.x - this.x) + Math.pow(fromPt.y - this.y));
  }
}

import Vector from './Vector';

export default class Point {

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.isClosed = false;
    this.color = false;
  }

  /**
   * Comparison operator.
   *
   * @param {Point} pt, point to be compared with.
   */
  eq(pt) {
    return pt instanceof Point && pt.x === this.x && pt.y === this.y;
  }

  /**
   * Substract given point and return Point/Vector.
   *
   * @param {Point} pt, point.
   * @param {Boolean} isToVector, true to return Vector; false to return Point.
   */
  sub(pt, isToVector = false) {
    if (isToVector) {
      return new Vector(this.x - pt.x,
                        this.y - pt.y,
                        this.z - pt.z);
    } else {
      return new Point(this.x - pt.x,
                       this.y - pt.y,
                       this.z - pt.z);
    }
  }

  /**
   * Return the distance between this point and fromPt point.
   *
   * @param {Point} fromPt, point to be compared with.
   */
  getDistance(fromPt) {
    return Math.sqrt(Math.pow(fromPt.x - this.x) + Math.pow(fromPt.y - this.y));
  }

  /**
   * Convert the point to a vector.
   */
  toVector() {
    return new Vector(this.x, this.y, this.z);
  }

}

export default class Vector {

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  eq(b) {
    return (b instanceof Vector &&
            this.x === b.x &&
            this.y === b.y &&
            this.z === b.z);
  }

  crossProd(b) {
    return (b instanceof Vector &&
            new Vector(this.y * b.z - this.z * b.y,
                       this.z * b.x - this.x * b.z,
                       this.x * b.y - this.y * b.x));
  }

  dotProd(b) {
    return (b instanceof Vector &&
            (this.x * b.x + this.y * b.y + this.z * b.z));
  }

  eqDirection(b, coords = 'z') {
    return (b instanceof Vector &&
            (this[coords] / Math.abs(this[coords]) === b[coords] / Math.abs(b[coords])));
  }

}

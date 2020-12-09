export class Vector {
	constructor(public x: number, public y: number) {}

	get magnitude(): number {
		return Math.sqrt(this.x ** 2 + this.y ** 2);
	}

	get unit(): Vector {
		return this.scale(1 / this.magnitude);
	}

	add(v: Vector) {
		return new Vector(this.x + v.x, this.y + v.y);
	}

	subtract(v: Vector) {
		return new Vector(this.x - v.x, this.y - v.y);
	}

	scale(n: number) {
		return new Vector(this.x * n, this.y * n);
	}

	square() {
		return new Vector(this.x ** 2, this.y ** 2);
	}

	dot(v: Vector) {
		return this.x * v.x + this.y * v.y;
	}

	gradient() {
		return Math.atan2(this.y, this.x);
	}
}

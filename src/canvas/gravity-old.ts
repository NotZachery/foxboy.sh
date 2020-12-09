import { Vector } from "./vector";

const particles: Particle[] = [];

class Particle {
	constructor(
		public mass = 1, // mass of this particle?
		public position = new Vector(0, 0),
		public velocity = new Vector(0, 0)
	) {
		particles.push(this);
	}

	/**
	 * Updates the particle, applying the force of gravity & changing its velocity.
	 */
	update(ctx: CanvasRenderingContext2D) {
		for (const particle of particles) {
			// prevent attracting to self
			if (particle == this) {
				continue;
			}

			const between = this.position.subtract(particle.position);

			const acceleration = between.unit
				.scale(particle.mass)
				.scale(-100 / Math.max(between.magnitude ** 2, 10));

			this.velocity = this.velocity.add(acceleration.scale(0.1));
		}

		this.position = this.position.add(this.velocity.scale(0.1));

		// if (this.position.y + this.velocity.y > window.innerHeight || this.position.y + this.velocity.y < 0) {
		// this.position.y = -this.position.y
		// }

		// if (this.position.x + this.velocity.x > window.innerHeight || this.position.x + this.velocity.x < 0) {
		// this.position.x = -this.position.x;
		// }

		this.draw(ctx);
	}

	/**
	 * Draws, colors, and fills a ball using the parameters given in the constructor
	 * @param ctx the HTML Canvas's 2D rendering context
	 */
	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();

		// Draws a ball
		// ctx.arc(this.x, this.y, 20, 0, Math.PI * 2, true);
		ctx.moveTo(this.position.x, this.position.y);
		ctx.lineTo(
			this.position.x + this.velocity.x,
			this.position.y + this.velocity.y
		);
		ctx.stroke();

		// Colors and fills the ball
		ctx.strokeStyle = "#fff";
		ctx.fillStyle = "#fff";
		ctx.fill();
	}
}

// generate 100 particles with random positions and velocities.
for (let i = 0; i < 100; i++) {
	particles.push(
		new Particle(
			Math.random() * 10,
			new Vector(
				Math.random() * window.innerWidth,
				Math.random() * window.innerHeight
			),
			new Vector(Math.random() - 0.5, Math.random() - 0.5)
		)
	);
}

// render the particles
export const render = (ctx: CanvasRenderingContext2D) => {
	for (const particle of particles) {
		particle.update(ctx);
	}

	requestAnimationFrame(() => render(ctx));
};

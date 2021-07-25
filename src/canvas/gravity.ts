import { canvas } from "../main";
import { colourutil } from "./colourutil";
import { Vector } from "./vector";

const particles: Particle[] = [];

export class Mouse {
	static getMousePos(event: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;
		return { x, y };
	}
}

window.addEventListener("mousemove", (event: MouseEvent) => {
	particles[particles.length - 1].position.x = Mouse.getMousePos(event).x;
	particles[particles.length - 1].position.y = Mouse.getMousePos(event).y;
});

class Particle {
	constructor(
		public mass = 1,
		public position = new Vector(0, 0),
		public velocity = new Vector(0, 0),

		public color: string,
		public mouse = false,
		public blackHole = false,
		public lastPos = new Vector(0, 0)
	) {
		particles.push(this);
	}

	/**
	 * Updates the particle, applying the force of gravity & changing its velocity.
	 */
	update(ctx: CanvasRenderingContext2D) {
		if (this.mouse) {
			return;
		}
		if (this.blackHole) {
			this.velocity = new Vector(0, 0);
			return;
		}
		for (const particle of particles) {
			// prevent attracting to self
			if (particle == this) {
				continue;
			}

			this.lastPos = this.position;
			const between = this.position.subtract(particle.position);

			const acceleration = between.unit
				.scale(particle.mass)
				.scale(-10000 / Math.max(between.magnitude ** 2, 100));

			this.velocity = this.velocity.add(acceleration.scale(0.2));
		}

		this.position = this.position.add(
			this.velocity.scale(this.blackHole ? 0.005 : 0.1)
		);

		// check for y out of bounds
		if (
			this.position.y > window.innerHeight + window.innerHeight / 2 &&
			this.velocity.gradient() > 0
		) {
			this.lastPos.y = 0;
			this.position.y = 0;
			this.drag(this.velocity);
		} else if (
			this.position.y < -window.innerHeight / 2 &&
			this.velocity.gradient() < 0
		) {
			this.lastPos.y = window.innerHeight;
			this.position.y = window.innerHeight;
			this.drag(this.velocity);
		}

		// check for x out of bounds
		if (
			this.position.x > window.innerWidth + window.innerWidth / 2 &&
			Math.abs(this.velocity.gradient()) < Math.PI / 2
		) {
			this.lastPos.x = 0;
			this.position.x = 0;
			this.drag(this.velocity);
		} else if (
			this.position.x < -window.innerWidth / 2 &&
			Math.abs(this.velocity.gradient()) > Math.PI / 2
		) {
			this.lastPos.x = window.innerWidth;
			this.position.x = window.innerWidth;
			this.drag(this.velocity);
		}

		this.velocity = this.velocity.add(
			this.velocity.scale(-0.0000001 * this.velocity.magnitude ** 2)
		);

		this.draw(ctx, this.velocity);
	}

	/**
	 * Draws, colors, and fills a ball using the parameters given in the constructor
	 * @param ctx the HTML Canvas's 2D rendering context
	 */
	draw(ctx: CanvasRenderingContext2D, velocity: Vector) {
		ctx.beginPath();
		ctx.moveTo(this.position.x, this.position.y);
		if (!this.blackHole) {
			ctx.lineTo(this.lastPos.x, this.lastPos.y);
			ctx.strokeStyle = "#" + this.color;
			ctx.stroke();
		} else {
			ctx.fillStyle = "#" + this.color;
			ctx.arc(this.lastPos.x, this.lastPos.y, 5, 0, Math.PI * 2, true);
			ctx.fill();
		}
	}

	drag(velocity: Vector) {
		this.velocity = velocity.scale(0.5);
	}
}

const spawnParticle = (position: Vector, velocity: Vector) => {
	particles.push(
		new Particle(
			0.0025,
			position,
			velocity,
			colourutil.getRandomLight(),
			false,
			false
		)
	);
};

for (let i = 0; i < 250; i++) {
	spawnParticle(
		new Vector(
			Math.random() * window.innerWidth,
			Math.random() * window.innerHeight
		),
		new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5)
	);
}

// big boi
particles.push(
	new Particle(
		0.85,
		new Vector(
			window.innerWidth - window.innerWidth / 4,
			window.innerHeight / 2 - window.innerHeight / 8
		),
		new Vector(Math.random() * 0.05 - 5, Math.random() * 0.05 - 5),
		"fff",
		false,
		true
	)
);

///
/// MOUSE REPELLER
///
particles.push(
	new Particle(
		-0.25,
		new Vector(window.innerWidth - 512, window.innerHeight / 2 - 128),
		new Vector(Math.random() * 0.05 - 5, Math.random() * 0.05 - 5),
		"fff",
		false,
		true
	)
);

///
/// PARTICLE RENDERER
///

// render the particles
let i = 0;
export const render = (ctx: CanvasRenderingContext2D) => {
	if (i++ % 60) {
		//ctx.fillStyle = "#00000010";
		ctx.fillStyle = `rgba(0,0,0,0.1)`;
		ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
	}

	// our 'black' hole
	ctx.fillStyle = "#fff";
	ctx.beginPath();
	ctx.ellipse(
		window.innerWidth - window.innerWidth / 4,
		window.innerHeight / 2 - window.innerHeight / 8,
		5,
		5,
		1,
		0,
		2 * Math.PI
	);
	ctx.fill();

	for (const particle of particles) {
		particle.update(ctx);
	}
	requestAnimationFrame(() => render(ctx));
};

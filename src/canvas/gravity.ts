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

// window.addEventListener(
// 	"click",
// 	(event: MouseEvent) => {
// 		spawnParticle(
// 			new Vector(event.clientX, event.clientY),
// 			new Vector(0, 0)
// 		);
// 	},
// 	false
// );

class Particle {
	constructor(
		public mass = 1, // mass of this particle?
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
				.scale(-10000 / Math.max(between.magnitude ** 2, 10));

			this.velocity = this.velocity.add(acceleration.scale(0.1));
		}

		this.position = this.position.add(
			this.velocity.scale(this.blackHole ? 0.005 : 0.1)
		);

		// check for y out of bounds
		if (
			this.position.y > window.innerHeight &&
			this.velocity.gradient() > 0
		) {
			this.lastPos.y = -10;
			this.position.y = -10;
		} else if (this.position.y < 0 && this.velocity.gradient() < 0) {
			this.lastPos.y = window.innerHeight + 10;
			this.position.y = window.innerHeight + 10;
		}

		// check for x out of bounds
		if (
			this.position.x > window.innerWidth &&
			Math.abs(this.velocity.gradient()) < Math.PI / 2
		) {
			this.lastPos.x = -10;
			this.position.x = -10;
		} else if (
			this.position.x < 0 &&
			Math.abs(this.velocity.gradient()) > Math.PI / 2
		) {
			this.lastPos.x = window.innerWidth + 10;
			this.position.x = window.innerWidth + 10;
		}

		this.velocity = this.velocity.add(
			this.velocity.scale(-0.000001 * this.velocity.magnitude ** 2)
		);

		this.draw(ctx);
	}

	/**
	 * Draws, colors, and fills a ball using the parameters given in the constructor
	 * @param ctx the HTML Canvas's 2D rendering context
	 */
	draw(ctx: CanvasRenderingContext2D) {
		// Colors and fills my balls :3

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
}

const drawVectorField = (ctx: CanvasRenderingContext2D) => {
	for (let x = 0; x < window.innerWidth; x += window.innerWidth / 10) {
		for (let y = 0; y < window.innerHeight; y += window.innerHeight / 10) {
			for (const particle of particles) {
				const between = new Vector(x, y).subtract(particle.position);

				const acceleration = between.unit
					.scale(particle.mass)
					.scale(-100 / Math.max(between.magnitude ** 2, 10));

				ctx.fillStyle = "#330000ff";

				ctx.moveTo(x, y);
				ctx.beginPath();
				ctx.lineTo(x + acceleration.x * 10, y + acceleration.y * 10);
				ctx.stroke();

				console.log(x + acceleration.x * 10, y + acceleration.y * 10);
			}
		}
	}
};

const spawnParticle = (position: Vector, velocity: Vector) => {
	particles.push(
		new Particle(
			0,
			position,
			velocity,
			colourutil.getRandomLight(),
			false,
			false
		)
	);
};

for (let i = 0; i < 50; i++) {
	spawnParticle(
		new Vector(
			Math.random() * window.innerWidth,
			Math.random() * window.innerHeight
		),
		new Vector(Math.random() * 10 - 5, Math.random() * 10 - 5)
	);
}

particles.push(
	new Particle(
		1,
		new Vector(window.innerWidth - 512, window.innerHeight / 2 - 128),
		new Vector(Math.random() * 0.05 - 5, Math.random() * 0.05 - 5),
		"fff",
		false,
		true
	)
);

particles.push(
	new Particle(
		-0.5,
		new Vector(window.innerWidth, window.innerHeight),
		new Vector(0, 0),
		"fff",
		true,
		false
	)
);

let i = 0;

// render the particles
export const render = (ctx: CanvasRenderingContext2D) => {
	if (i++ % 60) {
		//ctx.fillStyle = "#00000010";
		ctx.fillStyle = `rgba(0,0,0,0.05)`;
		ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
	}

	// our 'black' hole
	ctx.fillStyle = "#fff";
	ctx.beginPath();
	ctx.ellipse(
		window.innerWidth - 512,
		window.innerHeight / 2 - 128,
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

	// drawVectorField(ctx);

	requestAnimationFrame(() => render(ctx));
};

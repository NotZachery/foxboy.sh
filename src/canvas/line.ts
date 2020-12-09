class Line {
	/**
	 * Creates a new Ball object
	 * @param x the initial x position of the ball (relative to the top left corner of the Canvas). Default 100
	 * @param y the initial y position of the ball (relative to the top right corner of the Canvas). Default 100
	 * @param vx the initial velocity of the ball in the x direction. Default 5
	 * @param vy the initial velocity of the ball in the y direction. Default 2
	 * @param radius the radius of the ball. Default 25
	 * @param color the color of the ball. Default 'blue'
	 */
	constructor(
		public x = 100,
		public y = 100,
		private vx = 5,
		private vy = 2,
		private readonly color = "#fff"
	) {}

	/**
	 * Draws, colors, and fills a ball using the parameters given in the constructor
	 * @param ctx the HTML Canvas's 2D rendering context
	 */
	draw(ctx: CanvasRenderingContext2D) {
		ctx.beginPath();

		// Draws a ball
		// ctx.arc(this.x, this.y, 20, 0, Math.PI * 2, true);
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x - -this.vx, this.y - -this.vy);
		ctx.stroke();

		// Colors and fills the ball
		ctx.strokeStyle = this.color;
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	/**
	 * Recalculates the trajectory of the ball when it bounces.
	 *
	 * @param canvasWidth width of the HTML Canvas
	 * @param canvasHeight height of the HTML Canvas
	 */
	bounce() {
		this.x += this.vx;
		this.y += this.vy;

		this.vy *= 0.99;
		this.vy += 0.25;
		this.vx *= Math.max(1 - 0.0, 5 * this.vx ** 2, 0);

		// If the ball would fly off the top of the screen in the next step, or if would sink below it...
		if (this.y + this.vy > window.innerHeight || this.y + this.vy < 0) {
			// ...then reverse the direction of the ball's vertical velocity
			this.vy = -this.vy;
		}

		// If the ball would fly off to the left or right of the screen in the next step...
		if (this.x + this.vx > window.innerWidth || this.x + this.vx < 0) {
			// ...then reverse the direction of the ball's horizontal velocity
			this.vx = -this.vx;
		}
	}
}

export class BouncingBall {
	private readonly ctx: CanvasRenderingContext2D; // HTML Canvas's 2D context
	private readonly ball = new Line(
		Math.floor(Math.random() * 1920),
		Math.floor(Math.random() * 1)
	); // create a new ball with x and y 50 and other properties default

	/**
	 * Creates a new animation and sets properties of the animation
	 * @param canvas the HTML Canvas on which to draw
	 */
	constructor(canvas: HTMLCanvasElement) {
		this.ctx = canvas.getContext("2d");
		window.requestAnimationFrame(() => this.draw()); // start the animation when the window is ready
	}

	/**
	 * Draw step of the animation
	 */
	draw() {
		// this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
		this.ball.draw(this.ctx); // draw the ball in the new position
		this.ball.bounce(); // calculate the ball's new position

		window.requestAnimationFrame(() => this.draw()); // repeat the draw step when the window requests a frame
	}
}

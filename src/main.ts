import { render } from "./canvas/gravity";

export const canvas = <HTMLCanvasElement>document.getElementById("lines");

function main() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	window.addEventListener("resize", () => {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	});

	render(canvas.getContext("2d"));
}

main();

export class colourutil {
	static hex = ["6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];
	static getRandomLight() {
		let colour = "";
		let chosen = 0;
		for (let i = 0; i <= 5; i++) {
			if (
				(i % 2 == 0 && chosen != 1 && Math.floor(Math.random() * 4) == 1)
				|| (i == 4 && chosen != 1)
			) {
				colour += "ff";
				i++;
				chosen += 1;
				continue;
			}
			colour += colourutil.hex[Math.floor(Math.random() * 16)];
		}
		return colour;
	}
}

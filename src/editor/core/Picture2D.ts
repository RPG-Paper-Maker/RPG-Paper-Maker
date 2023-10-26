/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

class Picture2D {
	static async loadImage(path: string): Promise<HTMLImageElement> {
		return await new Promise((resolve, reject) => {
			const image: any = new Image();
			if (path) {
				image.onload = () => {
					resolve(image);
				};
				image.onerror = () => {
					image.width = 0;
					image.height = 0;
					resolve(image);
				};
				image.src = path;
			} else {
				resolve(image);
			}
		});
	}
}

export { Picture2D };

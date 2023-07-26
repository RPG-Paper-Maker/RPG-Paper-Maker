/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/
class IO {
	static async openFile(url: string): Promise<string> {
		return await new Promise((resolve, reject) => {
			const xhr = new XMLHttpRequest();
			xhr.onreadystatechange = () => {
				if (xhr.readyState === 4) {
					if (xhr.status === 200 || xhr.status === 0) {
						resolve(xhr.responseText);
					}
				}
			};
			xhr.open('GET', url, true);
			xhr.send(null);
		});
	}

	static async parseFileJSON(url: string): Promise<Record<string, any>> {
		const content = await IO.openFile(url);
		try {
			return JSON.parse(content);
		} catch (e) {
			return {};
		}
	}
}

export { IO };

/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

declare module '*.svg' {
	export const ReactComponent: React.FC<ReactElement.SVGProps<SVGSVGElement>>;
	const src: string;
	export default src;
}

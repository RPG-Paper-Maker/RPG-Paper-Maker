/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { Utils } from '../common';

type Props = {
	children?: ReactNode | ReactNode[];
	column?: boolean;
	one?: boolean;
	spaced?: boolean;
	spacedLarge?: boolean;
	paddingSmall?: boolean;
	centerV?: boolean;
	centerH?: boolean;
	centerSelfV?: boolean;
	rightH?: boolean;
	wrap?: boolean;
	fillWidth?: boolean;
	fillHeight?: boolean;
	zeroWidth?: boolean;
	zeroHeight?: boolean;
	fillSmallSpace?: boolean;
	disabledLabel?: boolean;
	scrollable?: boolean;
	className?: string;
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	[key: string]: unknown;
};

function Flex({
	children,
	column = false,
	one = false,
	spaced = false,
	spacedLarge = false,
	paddingSmall = false,
	centerV = false,
	centerH = false,
	centerSelfV = false,
	rightH = false,
	wrap = false,
	fillWidth = false,
	fillHeight = false,
	zeroWidth = false,
	zeroHeight = false,
	fillSmallSpace = false,
	disabledLabel = false,
	scrollable = false,
	className,
	onClick,
	...rest
}: Props) {
	return (
		<div
			className={Utils.getClassName(
				{
					flexColumn: column,
					flexOne: one,
					gapSmall: spaced,
					gapMedium: spacedLarge,
					paddingSmall,
					flexCenterV: centerV,
					flexCenterH: centerH,
					flexCenterSelfV: centerSelfV,
					flexRightHorizontally: rightH,
					flexWrap: wrap,
					fillWidth,
					fillHeight,
					zeroWidth,
					zeroHeight,
					fillSmallSpace,
					disabledLabel,
					scrollable,
				},
				`flex ${className ?? ''}`
			)}
			onClick={onClick}
			{...rest}
		>
			{children}
		</div>
	);
}

export default Flex;

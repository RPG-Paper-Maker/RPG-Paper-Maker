/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

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
	two?: boolean;
	spaced?: boolean;
	spacedLarge?: boolean;
	gap?: number;
	paddingSmall?: boolean;
	centerV?: boolean;
	centerH?: boolean;
	centerSelfV?: boolean;
	rightH?: boolean;
	columnMobile?: boolean;
	wrap?: boolean;
	fillWidth?: boolean;
	fillHeight?: boolean;
	zeroWidth?: boolean;
	zeroWidthNoMobile?: boolean;
	zeroHeight?: boolean;
	zeroHeightNoMobile?: boolean;
	fillSmallSpace?: boolean;
	disabledLabel?: boolean;
	scrollable?: boolean;
	scrollableNoMobile?: boolean;
	scrollableMobileOnly?: boolean;
	whiteSpaceNowrap?: boolean;
	className?: string;
	onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
	[key: string]: unknown;
};

function Flex({
	children,
	column = false,
	one = false,
	two = false,
	spaced = false,
	spacedLarge = false,
	gap,
	paddingSmall = false,
	centerV = false,
	centerH = false,
	centerSelfV = false,
	rightH = false,
	columnMobile = false,
	wrap = false,
	fillWidth = false,
	fillHeight = false,
	zeroWidth = false,
	zeroWidthNoMobile = false,
	zeroHeight = false,
	zeroHeightNoMobile = false,
	fillSmallSpace = false,
	disabledLabel = false,
	scrollable = false,
	scrollableNoMobile = false,
	scrollableMobileOnly = false,
	whiteSpaceNowrap = false,
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
					flexTwo: two,
					gapSmall: spaced,
					gapMedium: spacedLarge,
					paddingSmall,
					flexCenterV: centerV,
					flexCenterH: centerH,
					flexCenterSelfV: centerSelfV,
					flexRightHorizontally: rightH,
					mobileColumn: columnMobile,
					flexWrap: wrap,
					fillWidth,
					fillHeight,
					zeroWidth,
					zeroWidthNoMobile,
					zeroHeight,
					zeroHeightNoMobile,
					fillSmallSpace,
					disabledLabel,
					scrollable,
					scrollableNoMobile,
					scrollableMobileOnly,
					whiteSpaceNowrap,
				},
				`flex ${className ?? ''}`,
			)}
			style={gap ? { gap } : undefined}
			onClick={onClick}
			{...rest}
		>
			{children}
		</div>
	);
}

export default Flex;

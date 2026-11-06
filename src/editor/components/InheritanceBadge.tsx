/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { MouseEvent, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { FaLink, FaUndo } from 'react-icons/fa';
import { INHERITANCE_ORIGIN, Utils } from '../common';
import '../styles/InheritanceBadge.css';
import Button from './Button';
import Flex from './Flex';

type BadgeProps = {
	origin: INHERITANCE_ORIGIN;
	sourceName?: string;
};

export function InheritanceBadge({ origin, sourceName = '' }: BadgeProps) {
	const { t } = useTranslation();

	switch (origin) {
		case INHERITANCE_ORIGIN.INHERITED:
			return (
				<span className='inheritanceBadge' title={t('from.model', { model: sourceName })}>
					<FaLink />
				</span>
			);
		case INHERITANCE_ORIGIN.PARTIAL:
			return (
				<span
					className='inheritanceBadge inheritanceOverridden'
					title={t('partially.overrides.model', { model: sourceName })}
				>
					●
				</span>
			);
		case INHERITANCE_ORIGIN.OVERRIDDEN:
			return (
				<span
					className='inheritanceBadge inheritanceOverridden'
					title={t('overrides.model', { model: sourceName })}
				>
					●
				</span>
			);
		default:
			return null;
	}
}

type TextProps = {
	text: ReactNode;
	origin: INHERITANCE_ORIGIN;
	sourceName?: string;
};

export function InheritanceText({ text, origin, sourceName }: TextProps) {
	return (
		<Flex
			one
			spaced
			centerV
			className={Utils.getClassName({ inheritedItem: origin === INHERITANCE_ORIGIN.INHERITED })}
		>
			<span className='textEllipsis'>{text}</span>
			<InheritanceBadge origin={origin} sourceName={sourceName} />
		</Flex>
	);
}

type IndicatorProps = {
	isOverridden: boolean;
	sourceName: string;
	onRevert: () => void;
};

export function OverrideIndicator({ isOverridden, sourceName, onRevert }: IndicatorProps) {
	const { t } = useTranslation();

	return isOverridden ? (
		<Flex centerV spaced className='overrideIndicator' onMouseDown={(e: MouseEvent) => e.stopPropagation()}>
			<span
				className='inheritanceBadge inheritanceOverridden'
				title={t('overrides.model', { model: sourceName })}
			>
				●
			</span>
			<Button small onClick={onRevert} title={t('revert.to.model')}>
				<FaUndo />
			</Button>
		</Flex>
	) : (
		<span className='inheritanceBadge' title={t('from.model', { model: sourceName })}>
			<FaLink />
		</span>
	);
}

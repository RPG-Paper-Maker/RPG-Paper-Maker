/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Utils } from '../../../common';
import { Node } from '../../../core';
import { Model } from '../../../Editor';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree from '../../Tree';

const TREES_STYLE_HEIGHT = { height: '100px' };

type Props = {
	plugin: Model.Plugin | null;
	triggerUpdateParameters?: boolean;
	disabled?: boolean;
};

const PanelPluginDetails = forwardRef(({ plugin, triggerUpdateParameters, disabled = false }: Props, ref) => {
	const { t } = useTranslation();

	const [parameters, setParameters] = useState<Node[]>([]);

	const divClass = useMemo(() => Utils.getClassName({ disabledLabel: disabled }), [disabled]);

	const initialize = () => {
		if (plugin) {
			setParameters(Node.createList(plugin.parameters, false));
		}
	};

	const accept = () => {};

	useImperativeHandle(ref, () => ({
		initialize,
		accept,
	}));

	useLayoutEffect(() => {
		initialize();
		// eslint-disable-next-line
	}, [plugin, triggerUpdateParameters]);

	return (
		plugin && (
			<Flex one column scrollable>
				<Flex one column spacedLarge scrollable>
					{plugin.pictureBase64 && (
						<Flex centerH>
							<img src={plugin.pictureBase64} style={{ width: 'fit-content' }} alt='plugin' />
						</Flex>
					)}
					<div className={divClass}>
						<b>{t('name')}: </b>
						{plugin.name}
					</div>
					{plugin.author && (
						<div className={divClass}>
							<b>{t('author')}: </b>
							{plugin.author}
						</div>
					)}
					{plugin.description && (
						<div className={divClass}>
							<b>{t('description')}: </b>
							{plugin.description}
						</div>
					)}
					{plugin.version && (
						<div className={divClass}>
							<b>{t('version')}: </b>
							{plugin.version}
						</div>
					)}
					{plugin.website && (
						<div className={divClass}>
							<b>{t('website')}: </b>
							{disabled ? (
								plugin.website
							) : (
								<a href={plugin.website} target='_blank' rel='noreferrer'>
									{plugin.website}
								</a>
							)}
						</div>
					)}
					{plugin.tutorial && (
						<div className={divClass}>
							<b>{t('tutorial')}: </b>
							{disabled ? (
								plugin.tutorial
							) : (
								<a href={plugin.tutorial} target='_blank' rel='noreferrer'>
									{plugin.tutorial}
								</a>
							)}
						</div>
					)}
					{plugin.parameters.length > 0 && (
						<Groupbox title={t('parameters')} disabled={disabled}>
							<Flex one style={TREES_STYLE_HEIGHT}>
								<Tree
									constructorType={Model.PluginParameter}
									list={parameters}
									disabled={disabled}
									noScrollOnForce
									cannotDelete
									cannotAdd
									cannotDragDrop
									byIndex
									doNotShowID
								/>
							</Flex>
						</Groupbox>
					)}
					{plugin.commands.length > 0 && (
						<Groupbox title={t('commands')} disabled={disabled}>
							<Flex column spaced>
								<ul>
									{plugin.commands.map((command) => (
										<li key={command.id}>
											<b>
												{command.name}(
												{command.parameters.map((parameter) => parameter.name).join(', ')}
												):
											</b>{' '}
											{command.description}
										</li>
									))}
								</ul>
							</Flex>
						</Groupbox>
					)}
				</Flex>
			</Flex>
		)
	);
});

export default PanelPluginDetails;

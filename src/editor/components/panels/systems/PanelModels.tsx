/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BUTTON_TYPE } from '../../../common';
import { Node } from '../../../core/Node';
import { Project } from '../../../core/Project';
import { Model } from '../../../Editor';
import useStateNumber from '../../../hooks/useStateNumber';
import Button from '../../Button';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tree, { TREES_MIN_WIDTH } from '../../Tree';
import PanelMapObject, { PanelMapObjectRef } from '../PanelMapObject';

enum SELECTION_KIND {
	DEFAULT,
	HERO,
	LIST,
}

const PanelModels = forwardRef((props, ref) => {
	const { t } = useTranslation();

	const panelMapObjectRef = useRef<PanelMapObjectRef>(null);

	const [selectionType, setSelectionType] = useStateNumber();
	const [models, setModels] = useState<Node[]>([]);
	const [selectedModel, setSelectedModel] = useState<Model.CommonObject | null>(null);
	const [forcedCurrentIndex, setForcedCurrentIndex] = useState<number | null>(null);

	const isModelDisabled = useMemo(
		() => selectionType === SELECTION_KIND.LIST && (selectedModel === null || selectedModel.id === -1),
		[selectedModel, selectionType]
	);
	const typeDefault = useMemo(
		() => (selectionType === SELECTION_KIND.DEFAULT ? BUTTON_TYPE.PRIMARY : BUTTON_TYPE.DEFAULT),
		[selectionType]
	);
	const typeHero = useMemo(
		() => (selectionType === SELECTION_KIND.HERO ? BUTTON_TYPE.PRIMARY : BUTTON_TYPE.DEFAULT),
		[selectionType]
	);

	const initialize = () => {
		const commonEvents = Project.current!.commonEvents;
		setSelectedModel(commonEvents.defaultObject);
		setSelectionType(SELECTION_KIND.DEFAULT);
		setModels(Node.createList(commonEvents.commonObjects));
		setForcedCurrentIndex(-1);
	};

	const handleClickDefault = () => {
		setSelectedModel(Project.current!.commonEvents.defaultObject);
		setSelectionType(SELECTION_KIND.DEFAULT);
		setForcedCurrentIndex(-1);
	};

	const handleClickHero = () => {
		setSelectedModel(Project.current!.commonEvents.heroObject);
		setSelectionType(SELECTION_KIND.HERO);
		setForcedCurrentIndex(-1);
	};

	const handleSelectModel = (node: Node | null, isClick: boolean) => {
		if (node) {
			const model = node.content as Model.CommonObject;
			setSelectedModel(model);
			if (isClick) {
				setSelectionType(SELECTION_KIND.LIST);
			}
		}
	};

	const accept = () => {
		const commonEvents = Project.current!.commonEvents;
		commonEvents.commonObjects = Node.createListFromNodes(models);
	};

	useImperativeHandle(ref, () => ({
		initialize,
		accept,
	}));

	useLayoutEffect(() => {
		initialize();
	}, []);

	useLayoutEffect(() => {
		if (selectedModel) {
			panelMapObjectRef.current?.reset();
			panelMapObjectRef.current?.initialize();
		}
	}, [panelMapObjectRef.current, selectedModel]);

	return (
		<Flex spacedLarge fillWidth fillHeight>
			<Groupbox title={t('models')}>
				<Flex column spaced one fillHeight>
					<Button buttonType={typeDefault} onClick={handleClickDefault}>
						{t('default')}
					</Button>
					<Button buttonType={typeHero} onClick={handleClickHero}>
						{t('hero')}
					</Button>
					<Tree
						constructorType={Model.CommonObject}
						list={models}
						forcedCurrentSelectedItemIndex={forcedCurrentIndex}
						setForcedCurrentSelectedItemIndex={setForcedCurrentIndex}
						minWidth={TREES_MIN_WIDTH}
						onSelectedItem={handleSelectModel}
						noScrollOnForce
						scrollable
						showEditName
						applyDefault
						noFirstSelection
						doNotOpenDialog
					/>
				</Flex>
			</Groupbox>
			<Flex one>
				{selectedModel && !isModelDisabled && (
					<PanelMapObject object={selectedModel} ref={panelMapObjectRef} hideNameID saveOnUpdate />
				)}
			</Flex>
		</Flex>
	);
});

PanelModels.displayName = 'PanelModels';

export default PanelModels;

/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ArrayUtils } from '../../common';
import { Node } from '../../core/Node';
import { Project } from '../../core/Project';
import { Data, Model } from '../../Editor';
import useStateString from '../../hooks/useStateString';
import Button from '../Button';
import Dropdown from '../Dropdown';
import Flex from '../Flex';
import Form, { Label, Value } from '../Form';
import Groupbox from '../Groupbox';
import InputText from '../InputText';
import Tab from '../Tab';
import Tree from '../Tree';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

type Props = {
	setIsOpen: (b: boolean) => void;
	onAccept: () => void;
};

function DialogObjectCommandTest({ setIsOpen, onAccept }: Props) {
	const { t } = useTranslation();

	const [tests] = useState(new Data.ObjectCommandTests());
	const [configs, setConfigs] = useState<Model.ObjectCommandTestConfig[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const [tabIndex, setTabIndex] = useState(0);
	const [forcedCurrentIndex, setForcedCurrentIndex] = useState<number | null>(null);
	const [copied, setCopied] = useState<Model.ObjectCommandTestConfig | null>(null);
	const [name, setName] = useStateString();
	const [cameraPropertyID, setCameraPropertyID] = useState(0);
	const [variables, setVariables] = useState<Node[]>([]);
	const [currencies, setCurrencies] = useState<Node[]>([]);
	const [items, setItems] = useState<Node[]>([]);

	const titles = useMemo(() => configs.map((config) => Model.Base.create(config.id, config.name)), [configs, name]);
	const cameraPropertyOptions = useMemo(
		() => [Model.Base.create(0, t('default')), ...Project.current!.systems.cameraProperties],
		[t],
	);

	const updateSelectedConfig = (list: Model.ObjectCommandTestConfig[], index: number) => {
		setTabIndex(index);
		const config = list[index];
		if (config) {
			setName(config.name);
			setCameraPropertyID(config.cameraPropertyID);
			setVariables(Node.createList(config.variables, false));
			setCurrencies(Node.createList(config.currencies, false));
			setItems(Node.createList(config.items, false));
		}
	};

	const initialize = async () => {
		await tests.load();
		if (!tests.configs || tests.configs.length === 0) {
			tests.configs = [Model.ObjectCommandTestConfig.createConfig(1, `${t('test')} 1`)];
		}
		setConfigs(tests.configs);
		const index = Math.max(
			0,
			Math.min(Project.current!.settings.lastTabIndexObjectCommandTest, tests.configs.length - 1),
		);
		updateSelectedConfig(tests.configs, index);
		setForcedCurrentIndex(index);
		setIsLoaded(true);
	};

	const handleCurrentIndexChanged = (index: number) => {
		updateSelectedConfig(configs, index);
	};

	const handleChangeName = (n: string) => {
		setName(n);
		if (configs[tabIndex]) {
			configs[tabIndex].name = n;
		}
	};

	const handleChangeCameraPropertyID = (id: number) => {
		setCameraPropertyID(id);
		if (configs[tabIndex]) {
			configs[tabIndex].cameraPropertyID = id;
		}
	};

	const handleVariablesUpdated = () => {
		configs[tabIndex].variables = Node.createListFromNodes(variables);
	};

	const handleCurrenciesUpdated = () => {
		configs[tabIndex].currencies = Node.createListFromNodes(currencies);
	};

	const handleItemsUpdated = () => {
		configs[tabIndex].items = Node.createListFromNodes(items);
	};

	const addConfig = (config: Model.ObjectCommandTestConfig) => {
		configs.push(config);
		setConfigs([...configs]);
		tests.configs = configs;
		const index = configs.length - 1;
		updateSelectedConfig(configs, index);
		setForcedCurrentIndex(index);
	};

	const handleClickPlus = () => {
		const id = Model.Base.generateNewIDfromList(configs);
		addConfig(Model.ObjectCommandTestConfig.createConfig(id, `${t('test')} ${id}`));
	};

	const handleClickMinus = () => {
		ArrayUtils.removeAt(configs, tabIndex);
		setConfigs([...configs]);
		tests.configs = configs;
		const index = Math.max(0, Math.min(tabIndex, configs.length - 1));
		updateSelectedConfig(configs, index);
		setForcedCurrentIndex(index);
	};

	const handleClickCopy = () => {
		setCopied(configs[tabIndex].clone());
	};

	const handleClickPaste = () => {
		const config = copied!.clone();
		config.id = Model.Base.generateNewIDfromList(configs);
		addConfig(config);
	};

	const handleAccept = async () => {
		tests.configs = configs;
		await tests.save();
		Project.current!.settings.lastTabIndexObjectCommandTest = tabIndex;
		await Project.current!.settings.save();
		setIsOpen(false);
		onAccept();
	};

	const handleReject = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		initialize().catch(console.error);
	}, []);

	const getContent = () => (
		<Flex column spacedLarge one fillWidth scrollable>
			<Form>
				<Label>{t('name')}</Label>
				<Value>
					<InputText value={name} onChange={handleChangeName} />
				</Value>
				<Label>{t('camera.property')}</Label>
				<Value>
					<Dropdown
						selectedID={cameraPropertyID}
						onChange={handleChangeCameraPropertyID}
						options={cameraPropertyOptions}
					/>
				</Value>
			</Form>
			<Groupbox title={t('variables')}>
				<Flex one fillWidth>
					<Tree
						constructorType={Model.ObjectCommandTestVariable}
						list={variables}
						onListUpdated={handleVariablesUpdated}
						height={150}
						canBeEmpty
						scrollable
						cannotDragDrop
					/>
				</Flex>
			</Groupbox>
			<Groupbox title={t('currencies')}>
				<Flex one fillWidth>
					<Tree
						constructorType={Model.ObjectCommandTestCurrency}
						list={currencies}
						onListUpdated={handleCurrenciesUpdated}
						height={110}
						canBeEmpty
						scrollable
						cannotDragDrop
					/>
				</Flex>
			</Groupbox>
			<Groupbox title={t('items')}>
				<Flex one fillWidth>
					<Tree
						constructorType={Model.ObjectCommandTestItem}
						list={items}
						onListUpdated={handleItemsUpdated}
						height={110}
						canBeEmpty
						scrollable
						cannotDragDrop
					/>
				</Flex>
			</Groupbox>
		</Flex>
	);

	const getFooter = () => (
		<Flex spaced>
			<Button onClick={handleClickPlus}>+</Button>
			<Button onClick={handleClickMinus} disabled={configs.length <= 1}>
				-
			</Button>
			<Button onClick={handleClickCopy} disabled={configs.length === 0}>
				{t('copy')}
			</Button>
			<Button onClick={handleClickPaste} disabled={copied === null}>
				{t('paste')}
			</Button>
			<Flex one />
			<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />
		</Flex>
	);

	return (
		<Dialog
			title={`${t('test.command')}...`}
			isOpen
			footer={getFooter()}
			onClose={handleReject}
			initialWidth='600px'
			initialHeight='750px'
		>
			{isLoaded && (
				<Flex column fillWidth fillHeight>
					<Tab
						titles={titles}
						contents={configs.map(() => getContent())}
						onCurrentIndexChanged={handleCurrentIndexChanged}
						forcedCurrentIndex={forcedCurrentIndex}
						setForcedCurrentIndex={setForcedCurrentIndex}
						padding
						scrollableContent
					/>
				</Flex>
			)}
		</Dialog>
	);
}

export default DialogObjectCommandTest;

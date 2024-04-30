/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { ReactNode, useEffect, useState } from 'react';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import InputText from '../InputText';
import { Model } from '../../Editor';
import { Utils } from '../../common';
import useStateNumber from '../../hooks/useStateNumber';
import useStateString from '../../hooks/useStateString';
import { useTranslation } from 'react-i18next';
import Dropdown from '../Dropdown';
import Tree from '../Tree';
import Groupbox from '../Groupbox';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Tab from '../Tab';
import GraphicsSelector from '../GraphicsSelector';
import Form from '../Form';

type Props = {
	needOpen: boolean;
	setNeedOpen: (b: boolean) => void;
	model: Model.MapObject;
	onAccept: () => Promise<void>;
};

function DialogMapObject({ needOpen, setNeedOpen, model, onAccept }: Props) {
	const { t } = useTranslation();

	const [isOpen, setIsOpen] = useState(false);
	const [focusFirst, setFocustFirst] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [tabTitles, setTabTitles] = useState([Model.Base.create(1, 'Hero action')]);
	const [tabContents, setTabContents] = useState<ReactNode[]>([<Tree key={0} list={[]}></Tree>]);
	const [name, setName] = useStateString();
	const [id, setID] = useStateNumber();
	const [objectModel, setObjectModel] = useState(Model.Base.create(0, t('none')));
	const [graphicsOption, setGraphicsOption] = useState(Model.Base.GRAPHICS_OPTIONS[0]);

	const initialize = () => {
		setName(model.name);
		setID(model.id);
	};

	const handleAccept = async () => {
		setIsLoading(true);
		model.name = name;
		model.id = id;
		await onAccept();
		setIsLoading(false);
		setIsOpen(false);
	};

	const handleReject = () => {
		setIsOpen(false);
	};

	useEffect(() => {
		if (needOpen) {
			setNeedOpen(false);
			setFocustFirst(true);
			initialize();
			setIsOpen(true);
		}
		// eslint-disable-next-line
	}, [needOpen]);

	return (
		<Dialog
			title={`${t('edit.object')}...`}
			isOpen={isOpen}
			isLoading={isLoading}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='65%'
			initialHeight='85%'
		>
			<div className='flex-column fill-height gap-small'>
				<div className='flex-center-v gap-small'>
					<div className='flex-center-v gap-small'>
						{t('name')}:
						<InputText
							value={name}
							onChange={setName}
							focusFirst={focusFirst}
							setFocustFirst={setFocustFirst}
						/>
						ID: {Utils.formatNumberID(id)}
					</div>
					<div className='flex-one' />
					<div className='flex-center-v gap-small'>
						{t('model')}:
						<Dropdown value={objectModel} onUpdateValue={setObjectModel} options={[objectModel]} />
					</div>
				</div>
				<div className='flex-one gap-medium'>
					<div className='flex-one'>
						<Tab
							titles={tabTitles}
							setTitles={setTabTitles}
							contents={tabContents}
							setContents={setTabContents}
						/>
					</div>
					<div className='flex-column gap-small'>
						{t('states')}:<Tree list={[]}></Tree>
						{t('properties')}:<Tree list={[]}></Tree>
						{t('events')}:<Tree list={[]}></Tree>
						<div className='flex gap-small'>
							<div className='flex-column gap-small'>
								{t('graphics')}:
								<GraphicsSelector />
								<Dropdown
									value={graphicsOption}
									onUpdateValue={setGraphicsOption}
									options={Model.Base.GRAPHICS_OPTIONS}
									translateOptions
								/>
							</div>
							<div className='flex-column flex-one gap-small'>
								<Groupbox title={t('moving')}>
									<Form>
										<td>{t('type')}:</td>
										<td>
											<Dropdown
												value={objectModel}
												onUpdateValue={setObjectModel}
												options={[objectModel]}
											/>
										</td>
										<td></td>
										<td>
											<Button disabled>{t('edit.route')}...</Button>
										</td>
										<td>{t('speed')}:</td>
										<td>
											<Dropdown
												value={objectModel}
												onUpdateValue={setObjectModel}
												options={[objectModel]}
											/>
										</td>
										<td>{t('frequency')}:</td>
										<td>
											<Dropdown
												value={objectModel}
												onUpdateValue={setObjectModel}
												options={[objectModel]}
											/>
										</td>
									</Form>
								</Groupbox>
								<Button>{t('edit.transformations')}...</Button>
							</div>
						</div>
						<div className='flex'>
							<Groupbox title={t('options')}>
								<div className='flex'>
									<div className='flex-column'>
										<Checkbox>{t('move.animation')}</Checkbox>
										<Checkbox>{t('stop.animation')}</Checkbox>
										<Checkbox>{t('climb.animation')}</Checkbox>
										<Checkbox>{t('direction.fix')}</Checkbox>
									</div>
									<div className='flex-column'>
										<Checkbox>{t('through')}</Checkbox>
										<Checkbox>{t('set.with.camera')}</Checkbox>
										<Checkbox>{t('pixel.offset')}</Checkbox>
										<Checkbox>{t('keep.position')}</Checkbox>
									</div>
									<div className='flex-one' />
								</div>
							</Groupbox>
						</div>
					</div>
				</div>
				<div className='flex'>
					<Checkbox>
						<div className='flex-center-v gap-small'>
							{t('detection')} <Button disabled>...</Button>
						</div>
					</Checkbox>
					<Checkbox>{t('only.one.event.per.frame')}</Checkbox>
					<Checkbox>{t('can.be.triggered.another.object')}</Checkbox>
				</div>
			</div>
		</Dialog>
	);
}

export default DialogMapObject;

/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { INPUT_TYPE_WIDTH, IO, Paths } from '../../common';
import { Project } from '../../core/Project';
import { setNeedsReloadMap } from '../../store';
import Button from '../Button';
import Flex from '../Flex';
import InputText from '../InputText';
import Dialog from './Dialog';
import FooterCancelOK from './footers/FooterCancelOK';

export enum LOCATION_TYPE {
	BR,
	DLCS,
}

type Props = {
	setIsOpen: (location: LOCATION_TYPE | null) => void;
	locationType: LOCATION_TYPE;
};

function DialogPathLocation({ setIsOpen, locationType }: Props) {
	const { t } = useTranslation();

	const getCurrentLocation = () => {
		switch (locationType) {
			case LOCATION_TYPE.BR:
				return Project.current!.systems.PATH_BR;
			case LOCATION_TYPE.DLCS:
				return Project.current!.systems.PATH_DLCS;
		}
	};

	const [isLoading, setIsLoading] = useState(false);
	const [location, setLocation] = useState(getCurrentLocation());

	const dispatch = useDispatch();

	const handleClickChangeLocation = async () => {
		const path = await IO.openFolderDialog(location);
		if (path) {
			setLocation(path);
		}
	};

	const handleClickAuto = async () => {
		let folderName: string;
		switch (locationType) {
			case LOCATION_TYPE.BR:
				folderName = Paths.BR;
				break;
			case LOCATION_TYPE.DLCS:
				folderName = Paths.DLCS;
				break;
		}
		setLocation(Paths.join(window.__dirname, folderName));
	};

	const handleAccept = async () => {
		setIsLoading(true);
		switch (locationType) {
			case LOCATION_TYPE.BR:
				Project.current!.systems.PATH_BR = location;
				break;
			case LOCATION_TYPE.DLCS:
				Project.current!.systems.PATH_DLCS = location;
				break;
		}
		dispatch(setNeedsReloadMap());
		await Project.current!.systems.save();
		setIsOpen(null);
	};

	const handleReject = async () => {
		setIsOpen(null);
	};

	return (
		<>
			<Dialog
				isOpen
				title={`${t('choose.location')}...`}
				footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
				onClose={handleReject}
				isLoading={isLoading}
				initialWidth='600px'
			>
				<Flex spaced fillWidth fillHeight>
					<div>{t('location')}:</div>
					<Flex one>
						<InputText value={location} onChange={setLocation} widthType={INPUT_TYPE_WIDTH.FILL} />
					</Flex>
					<Button onClick={handleClickChangeLocation}>...</Button>
					<Button onClick={handleClickAuto}>{t('auto')}</Button>
				</Flex>
			</Dialog>
		</>
	);
}

export default DialogPathLocation;

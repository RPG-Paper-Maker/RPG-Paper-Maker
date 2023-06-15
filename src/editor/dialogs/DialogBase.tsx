/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import Dialog from 'rc-dialog';
import FooterCancelOK from './footers/FooterCancelOK';
import 'rc-dialog/assets/index.css';

type Props = {
	children: any;
	setDialog: React.Dispatch<React.SetStateAction<JSX.Element>>;
	title: string;
	onClose?: () => void;
	onAccept?: () => Promise<boolean>;
	onReject?: () => void;
};

function DialogBase({ children, title, setDialog, onClose, onAccept, onReject }: Props) {
	const [visibleDialog, setVisibleDialog] = React.useState(true);

	const handleOnClose = async () => {
		if (setDialog) {
			setDialog(<React.Fragment></React.Fragment>);
		} else {
			setVisibleDialog(false);
		}
		if (onClose) {
			await onClose();
		}
	};

	const handleOnAccept = async () => {
		if (onAccept) {
			if (!(await onAccept())) {
				return;
			}
		}
		handleOnClose();
	};

	const handleOnReject = async () => {
		if (onReject) {
			await onReject();
		}
		handleOnClose();
	};

	return (
		<React.Fragment>
			<Dialog
				title={title}
				onClose={handleOnReject}
				visible={visibleDialog}
				footer={<FooterCancelOK onCancel={handleOnReject} onOK={handleOnAccept} />}
			>
				{children}
			</Dialog>
		</React.Fragment>
	);
}

export default DialogBase;

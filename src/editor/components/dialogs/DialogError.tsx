/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoIosSend } from 'react-icons/io';
import { MdHistory } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { BUTTON_TYPE, Constants, IO } from '../../common';
import { Project } from '../../core/Project';
import { getEngineUpdate, type EngineUpdate } from '../../data/EngineVersion';
import { RootState, setErrorDialog } from '../../store';
import Button from '../Button';
import Checkbox from '../Checkbox';
import Flex from '../Flex';
import InputText from '../InputText';
import TextArea from '../TextArea';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';
import DialogManageBackups from './DialogManageBackups';
import FooterOK from './footers/FooterOK';

const GPU_FEATURES = ['gpu_compositing', '2d_canvas', 'rasterization', 'opengl', 'webgl', 'webgpu', 'video_decode'];

type GraphicsInformation = {
	error?: string;
	features?: Record<string, string>;
	info?: {
		auxAttributes?: Record<string, unknown>;
		gpuDevice?: {
			active?: boolean;
			deviceString?: string;
			driverVersion?: string;
			vendorId?: number;
			deviceId?: number;
		}[];
	};
};

export function summarizeGraphics(graphics: unknown): string {
	const data = (graphics ?? {}) as GraphicsInformation;
	if (data.error) {
		return `Error: ${data.error}`;
	}
	const aux = data.info?.auxAttributes ?? {};
	const lines = (Array.isArray(data.info?.gpuDevice) ? data.info.gpuDevice : []).map(
		(device) =>
			`GPU (${device.active ? 'active' : 'inactive'}): ${device.deviceString || `vendor ${device.vendorId} device ${device.deviceId}`}, driver ${device.driverVersion ?? 'unknown'}`,
	);
	for (const [label, key] of [
		['Renderer', 'glRenderer'],
		['OpenGL', 'glVersion'],
		['Display', 'displayType'],
		['DirectX 12', 'dx12FeatureLevel'],
		['Vulkan', 'vulkanVersion'],
	]) {
		if (aux[key] !== undefined && aux[key] !== '') {
			lines.push(`${label}: ${aux[key]}`);
		}
	}
	const features = GPU_FEATURES.filter((name) => data.features?.[name] !== undefined);
	if (features.length > 0) {
		lines.push(`Features: ${features.map((name) => `${name}=${data.features?.[name]}`).join(', ')}`);
	}
	return lines.join('\n') || '(empty)';
}

function DialogError() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const errorDialog = useSelector((state: RootState) => state.projects.errorDialog);
	const [email, setEmail] = useState('');
	const [isDescription, setIsDescription] = useState(false);
	const [description, setDescription] = useState('');
	const [sendStatus, setSendStatus] = useState<{ ok: boolean; message: string } | null>(null);
	const [loading, setLoading] = useState(false);
	const [isBackupsOpen, setIsBackupsOpen] = useState(false);
	const [engineUpdate, setEngineUpdate] = useState<EngineUpdate | null>(null);
	const [isUpdateWarningAcknowledged, setIsUpdateWarningAcknowledged] = useState(false);

	useEffect(() => {
		setEngineUpdate(null);
		setIsUpdateWarningAcknowledged(false);
		setSendStatus(null);
		setDescription('');
		setIsDescription(false);
		if (!errorDialog) {
			return;
		}
		let isCurrent = true;
		void getEngineUpdate().then((update) => {
			if (isCurrent) {
				setEngineUpdate(update);
			}
		});
		return () => {
			isCurrent = false;
		};
	}, [errorDialog]);

	if (!errorDialog) {
		return null;
	}

	const isBugReport = !!errorDialog.isBugReport;
	const isDescriptionVisible = isBugReport || isDescription;

	const sendErrorReport = async () => {
		setSendStatus(null);
		setLoading(true);
		try {
			const platform = Constants.IS_DESKTOP ? await IO.getOS() : 'web';
			const updaterVersion = Constants.IS_DESKTOP ? await IO.getUpdaterVersion() : undefined;
			const graphicsInformation = Constants.IS_DESKTOP ? await IO.getGraphicsInformation() : undefined;
			const message = graphicsInformation
				? `${errorDialog.message}\n\nGPU summary:\n${summarizeGraphics(graphicsInformation)}`
				: errorDialog.message;
			const res = await fetch('https://rpg-paper-maker.com/wp-json/rpm/v1/report', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					version: Project.VERSION || 'Not loaded',
					updaterVersion,
					os: `${platform} | ${navigator.userAgent}`,
					message,
					stack: errorDialog.stack,
					email,
					description: isDescriptionVisible ? description : undefined,
				}),
			});
			if (res.status === 429) {
				setSendStatus({ ok: false, message: t('error.dialog.send.too.many.requests') });
				setLoading(false);
				return;
			}
			if (!res.ok) {
				throw new Error(`${res.status} ${res.statusText}`);
			}
			setSendStatus({ ok: true, message: t('error.dialog.sent') });
		} catch (e) {
			setSendStatus({ ok: false, message: t('error.dialog.send.error', { error: (e as Error).message }) });
		}
		setLoading(false);
	};

	const handleClose = () => {
		dispatch(setErrorDialog(null));
	};

	return (
		<>
			<Dialog
				isOpen
				title={t(isBugReport ? 'bug.report.dialog.title' : 'error.dialog.title')}
				footer={
					<FooterOK
						onOK={
							engineUpdate && !isUpdateWarningAcknowledged
								? () => setIsUpdateWarningAcknowledged(true)
								: handleClose
						}
						leftContent={
							(engineUpdate && !isUpdateWarningAcknowledged) || isBugReport ? undefined : (
								<Flex centerV spaced>
									<Checkbox isChecked={isDescription} onChange={setIsDescription}>
										{t('error.dialog.optional.description')}
									</Checkbox>
									{Project.current && (
										<Button icon={<MdHistory />} onClick={() => setIsBackupsOpen(true)}>
											{t('manage.backups')}
										</Button>
									)}
								</Flex>
							)
						}
					/>
				}
				onClose={handleClose}
				zIndex={Z_INDEX_LEVEL.LAYER_TOP}
				isLoading={loading}
				initialHeight='300px'
			>
				{engineUpdate && !isUpdateWarningAcknowledged ? (
					<Flex column spaced>
						<p>{t('error.dialog.outdated', engineUpdate)}</p>
					</Flex>
				) : (
					<Flex column spaced>
						<p>{t(isBugReport ? 'bug.report.dialog.intro' : 'error.dialog.intro')}</p>
						{sendStatus ? (
							<div
								style={{
									color: sendStatus.ok ? 'var(--green-color)' : 'var(--red-color)',
								}}
							>
								{sendStatus.message}
							</div>
						) : (
							<Flex column={isDescriptionVisible} spaced fillWidth fillHeight centerV>
								<Flex one />
								<InputText
									value={email}
									onChange={setEmail}
									placeholder={t('error.dialog.optional.mail')}
									style={{ width: isDescriptionVisible ? '100%' : undefined }}
								/>
								{isDescriptionVisible && (
									<TextArea
										text={description}
										onChange={setDescription}
										placeholder={t(
											isBugReport
												? 'bug.report.dialog.description'
												: 'error.dialog.optional.description',
										)}
										smallDefaultHeight
									/>
								)}
								<Button
									icon={<IoIosSend />}
									buttonType={BUTTON_TYPE.PRIMARY}
									onClick={sendErrorReport}
									disabled={!!sendStatus || (isBugReport && description.trim().length === 0)}
									fillWidth={isDescriptionVisible}
								>
									{t(isBugReport ? 'bug.report.dialog.send' : 'error.dialog.mail')}
								</Button>
								<Flex one />
							</Flex>
						)}
					</Flex>
				)}
			</Dialog>
			{Project.current && (
				<DialogManageBackups isOpen={isBackupsOpen} setIsOpen={setIsBackupsOpen} onAfterRestore={handleClose} />
			)}
		</>
	);
}

export default DialogError;

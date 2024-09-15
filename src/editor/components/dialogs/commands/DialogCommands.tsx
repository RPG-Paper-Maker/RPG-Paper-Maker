/*
    RPG Paper Maker Copyright (C) 2017-2024 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useTranslation } from 'react-i18next';
import { Model } from '../../../Editor';
import Button from '../../Button';
import Flex from '../../Flex';
import Groupbox from '../../Groupbox';
import Tab from '../../Tab';
import Dialog from '../Dialog';
import FooterCancelOK from '../footers/FooterCancelOK';

type Props = {
	isOpen: boolean;
	setIsOpen: (b: boolean) => void;
};

function DialogCommands({ isOpen, setIsOpen }: Props) {
	const { t } = useTranslation();

	const handleAccept = async () => {
		setIsOpen(false);
	};

	const handleReject = async () => {
		setIsOpen(false);
	};

	const getStagingContent = () => (
		<Flex spaced key={0}>
			<Flex column one spaced>
				<Groupbox title={t('dialogs')}>
					<Flex column spaced>
						<Button>{t('show.text')}...</Button>
						<Button>{t('display.choices')}...</Button>
						<Button>{t('input.number')}...</Button>
						<Button>{t('set.dialog.box.options')}...</Button>
					</Flex>
				</Groupbox>
				<Groupbox title={t('visual.effects')}>
					<Flex column spaced>
						<Button>{t('change.screen.tone')}...</Button>
						<Button>{t('shake.screen')}...</Button>
						<Button>{t('flash.screen')}...</Button>
						<Button>{t('change.weather')}...</Button>
						<Button>{t('change.map.properties')}...</Button>
						<Button>{t('switch.texture')}...</Button>
					</Flex>
				</Groupbox>
				<Groupbox title={t('time')}>
					<Flex column spaced>
						<Button>{t('wait')}...</Button>
						<Button>{t('change.chronometer')}...</Button>
					</Flex>
				</Groupbox>
				<Flex one />
			</Flex>
			<Flex column one spaced>
				<Groupbox title={t('moves.animations.camera')}>
					<Flex column spaced>
						<Button>{t('teleport.object')}...</Button>
						<Button>{t('move.object')}...</Button>
						<Button>{t('display.an.animation')}...</Button>
						<Button>{t('move.camera')}...</Button>
						<Button>{t('reset.camera')}</Button>
						<Button>{t('create.object.in.map')}...</Button>
						<Button>{t('remove.object.from.map')}...</Button>
					</Flex>
				</Groupbox>
				<Groupbox title={t('media')}>
					<Flex column spaced>
						<Button>{t('display.a.picture')}...</Button>
						<Button>{t('set.move.turn.a.picture')}...</Button>
						<Button>{t('remove.a.picture')}...</Button>
						<Button>{t('play.a.video')}...</Button>
					</Flex>
				</Groupbox>
				<Flex one />
			</Flex>
		</Flex>
	);

	const getMapContent = () => (
		<Flex spaced key={1}>
			<Flex column one spaced>
				<Groupbox title={t('menus')}>
					<Flex column spaced>
						<Button>{t('start.shop.menu')}...</Button>
						<Button>{t('restock.shop')}...</Button>
						<Button>{t('enter.a.name.menu')}...</Button>
						<Button>{t('open.main.menu')}</Button>
						<Button>{t('open.saves.menu')}</Button>
						<Button>{t('title.screen')}</Button>
						<Button>{t('game.over')}</Button>
					</Flex>
				</Groupbox>
				<Groupbox title={t('musics.sounds')}>
					<Flex column spaced>
						<Button>{t('play.music')}...</Button>
						<Button>{t('stop.music')}...</Button>
						<Button>{t('play.background.sound')}...</Button>
						<Button>{t('stop.background.sound')}...</Button>
						<Button>{t('play.a.sound')}...</Button>
						<Button>{t('stop.a.sound')}...</Button>
						<Button>{t('play.music.effect')}...</Button>
					</Flex>
				</Groupbox>
			</Flex>
			<Flex column one spaced>
				<Groupbox title={t('objects.interactions')}>
					<Flex column spaced>
						<Button>{t('send.event')}...</Button>
						<Button>{t('change.state')}...</Button>
						<Button>{t('change.property')}...</Button>
					</Flex>
				</Groupbox>
				<Groupbox title={t('team')}>
					<Flex column spaced>
						<Button>{t('modify.currency')}...</Button>
						<Button>{t('modify.inventory')}...</Button>
						<Button>{t('modify.team')}...</Button>
					</Flex>
				</Groupbox>
				<Groupbox title={t('system.parameters')}>
					<Flex column spaced>
						<Button>{t('allow.forbid.saves')}...</Button>
						<Button>{t('allow.forbid.main.menu')}...</Button>
					</Flex>
				</Groupbox>
			</Flex>
		</Flex>
	);

	const getBattleContent = () => (
		<Flex spaced key={2}>
			<Flex column one spaced>
				<Groupbox title={t('battles')}>
					<Flex column spaced>
						<Button>{t('start.battle')}...</Button>
						<Button>{t('change.battler.graphics')}...</Button>
						<Button>{t('display.hide.a.battler')}...</Button>
						<Button>{t('transform.a.battler')}...</Button>
						<Button>{t('force.an.action')}...</Button>
						<Button>{t('end.battle')}</Button>
					</Flex>
				</Groupbox>
				<Groupbox title={t('musics')}>
					<Flex column spaced>
						<Button>{t('change.battle.music')}...</Button>
						<Button>{t('change.victory.music')}...</Button>
					</Flex>
				</Groupbox>
			</Flex>
			<Flex column one spaced>
				<Groupbox title={t('heroes.enemies')}>
					<Flex column spaced>
						<Button>{t('change.a.statistic')}...</Button>
						<Button>{t('change.experience.curve')}...</Button>
						<Button>{t('change.status')}...</Button>
						<Button>{t('change.a.skill')}...</Button>
						<Button>{t('change.name')}...</Button>
						<Button>{t('change.class')}...</Button>
						<Button>{t('change.equipment')}...</Button>
					</Flex>
				</Groupbox>
			</Flex>
		</Flex>
	);

	const getStructureContent = () => (
		<Flex spaced key={3}>
			<Flex column one spaced>
				<Groupbox title={t('syntax')}>
					<Flex column spaced>
						<Button>{t('condition')}...</Button>
						<Button>{t('loop')}</Button>
						<Button>{t('break.loop')}</Button>
						<Button>{t('label')}...</Button>
						<Button>{t('jump.to.label')}...</Button>
						<Button>{t('stop.reaction')}</Button>
						<Button>{t('comment')}...</Button>
						<Button>{t('call.a.common.reaction')}...</Button>
					</Flex>
				</Groupbox>
			</Flex>
			<Flex column one spaced>
				<Groupbox title={t('variables')}>
					<Flex column spaced>
						<Button>{t('change.variables')}...</Button>
					</Flex>
				</Groupbox>
				<Groupbox title={t('advanced')}>
					<Flex column spaced>
						<Button>{t('script')}...</Button>
						<Button>{t('plugin')}...</Button>
					</Flex>
				</Groupbox>
			</Flex>
		</Flex>
	);

	return (
		<Dialog
			title={`${t('commands')}...`}
			isOpen={isOpen}
			footer={<FooterCancelOK onCancel={handleReject} onOK={handleAccept} />}
			onClose={handleReject}
			initialWidth='500px'
			initialHeight='550px'
		>
			<Tab
				hideScroll
				titles={[
					Model.Base.create(1, t('staging')),
					Model.Base.create(2, t('map')),
					Model.Base.create(3, t('battle')),
					Model.Base.create(4, t('structure')),
				]}
				contents={[getStagingContent(), getMapContent(), getBattleContent(), getStructureContent()]}
			/>
		</Dialog>
	);
}

export default DialogCommands;

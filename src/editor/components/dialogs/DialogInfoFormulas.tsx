/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { useTranslation } from 'react-i18next';
import '../../styles/DialogInfoFormulas.css';
import Dialog from './Dialog';
import FooterOK from './footers/FooterOK';

type Props = {
	setIsOpen: (b: boolean) => void;
};

function DialogInfoFormulas({ setIsOpen }: Props) {
	const { t } = useTranslation();

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<Dialog
			isOpen
			title={t('formulas.overview')}
			footer={<FooterOK onOK={handleClose} />}
			onClose={handleClose}
			initialWidth='700px'
			initialHeight='600px'
		>
			<div className='dialogInfoFormulas'>
				<div className='formulaSection'>{t('formulas.section.context')}</div>
				<table>
					<thead>
						<tr>
							<th>{t('formulas.header.formula')}</th>
							<th>{t('formulas.header.description')}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<code>u</code>
							</td>
							<td>{t('formulas.context.u')}</td>
						</tr>
						<tr>
							<td>
								<code>t</code>
							</td>
							<td>{t('formulas.context.t')}</td>
						</tr>
						<tr>
							<td>
								<code>damage</code>
							</td>
							<td>{t('formulas.context.damage')}</td>
						</tr>
						<tr>
							<td>
								<code>$object, $object.id, $object.system.name</code>
							</td>
							<td>{t('formulas.context.object')}</td>
						</tr>
					</tbody>
				</table>

				<div className='formulaSection'>{t('formulas.section.stats')}</div>
				<table>
					<thead>
						<tr>
							<th>{t('formulas.header.formula')}</th>
							<th>{t('formulas.header.description')}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<code>{'u.{abbr}'}</code>
							</td>
							<td>{t('formulas.stats.current')}</td>
						</tr>
						<tr>
							<td>
								<code>{'u.max{abbr}'}</code>
							</td>
							<td>{t('formulas.stats.max')}</td>
						</tr>
					</tbody>
				</table>

				<div className='formulaSection'>{t('formulas.section.properties')}</div>
				<table>
					<thead>
						<tr>
							<th>{t('formulas.header.formula')}</th>
							<th>{t('formulas.header.description')}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<code>u.name</code>
							</td>
							<td>{t('formulas.properties.name')}</td>
						</tr>
						<tr>
							<td>
								<code>u.equip[i]</code>
							</td>
							<td>{t('formulas.properties.equip')}</td>
						</tr>
						<tr>
							<td>
								<code>u.skills</code>
							</td>
							<td>{t('formulas.properties.skills')}</td>
						</tr>
						<tr>
							<td>
								<code>u.status</code>
							</td>
							<td>{t('formulas.properties.status')}</td>
						</tr>
						<tr>
							<td>
								<code>u.elements</code>
							</td>
							<td>{t('formulas.properties.elements')}</td>
						</tr>
					</tbody>
				</table>

				<div className='formulaSection'>{t('formulas.section.damage')}</div>
				<table>
					<thead>
						<tr>
							<th>{t('formulas.header.formula')}</th>
							<th>{t('formulas.header.description')}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<code>u.atk - t.def</code>
							</td>
							<td>{t('formulas.damage.physical')}</td>
						</tr>
						<tr>
							<td>
								<code>u.mag - t.mdef</code>
							</td>
							<td>{t('formulas.damage.magical')}</td>
						</tr>
						<tr>
							<td>
								<code>Math.max(1, u.atk * 2 - t.def)</code>
							</td>
							<td>{t('formulas.damage.minimum')}</td>
						</tr>
						<tr>
							<td>
								<code>u.mag * 1.5</code>
							</td>
							<td>{t('formulas.damage.healing')}</td>
						</tr>
						<tr>
							<td>
								<code>Math.ceil(t.maxhp * 0.25)</code>
							</td>
							<td>{t('formulas.damage.percent.heal')}</td>
						</tr>
						<tr>
							<td>
								<code>(u.atk * 0.7) + (u.dex * 0.3) - t.def</code>
							</td>
							<td>{t('formulas.damage.composite')}</td>
						</tr>
					</tbody>
				</table>

				<div className='formulaSection'>{t('formulas.section.precision.critical')}</div>
				<table>
					<thead>
						<tr>
							<th>{t('formulas.header.formula')}</th>
							<th>{t('formulas.header.description')}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<code>100</code>
							</td>
							<td>{t('formulas.precision.always')}</td>
						</tr>
						<tr>
							<td>
								<code>80 + (u.level - t.level) * 2</code>
							</td>
							<td>{t('formulas.precision.level.scaled')}</td>
						</tr>
						<tr>
							<td>
								<code>5</code>
							</td>
							<td>{t('formulas.critical.flat')}</td>
						</tr>
						<tr>
							<td>
								<code>u.lck / 10</code>
							</td>
							<td>{t('formulas.critical.luck')}</td>
						</tr>
						<tr>
							<td>
								<code>damage * 1.5</code>
							</td>
							<td>{t('formulas.critical.multiplier')}</td>
						</tr>
						<tr>
							<td>
								<code>20</code>
							</td>
							<td>{t('formulas.variance')}</td>
						</tr>
					</tbody>
				</table>

				<div className='formulaSection'>{t('formulas.section.utility')}</div>
				<table>
					<thead>
						<tr>
							<th>{t('formulas.header.formula')}</th>
							<th>{t('formulas.header.description')}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<code>Math.max(a, b)</code>
							</td>
							<td>{t('formulas.utility.max')}</td>
						</tr>
						<tr>
							<td>
								<code>Math.min(a, b)</code>
							</td>
							<td>{t('formulas.utility.min')}</td>
						</tr>
						<tr>
							<td>
								<code>Math.round(x)</code>
							</td>
							<td>{t('formulas.utility.round')}</td>
						</tr>
						<tr>
							<td>
								<code>Math.floor(x) / Math.ceil(x)</code>
							</td>
							<td>{t('formulas.utility.floor.ceil')}</td>
						</tr>
						<tr>
							<td>
								<code>Common.Mathf.random(min, max)</code>
							</td>
							<td>{t('formulas.utility.random')}</td>
						</tr>
						<tr>
							<td>
								<code>Common.Mathf.variance(value, %)</code>
							</td>
							<td>{t('formulas.utility.variance')}</td>
						</tr>
					</tbody>
				</table>

				<div className='formulaSection'>{t('formulas.section.game')}</div>
				<table>
					<thead>
						<tr>
							<th>{t('formulas.header.formula')}</th>
							<th>{t('formulas.header.description')}</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<code>Core.Game.current.variables.get(id)</code>
							</td>
							<td>{t('formulas.game.variable')}</td>
						</tr>
						<tr>
							<td>
								<code>Core.Game.current.items</code>
							</td>
							<td>{t('formulas.game.items')}</td>
						</tr>
						<tr>
							<td>
								<code>Core.Game.current.playTime</code>
							</td>
							<td>{t('formulas.game.playtime')}</td>
						</tr>
					</tbody>
				</table>
			</div>
		</Dialog>
	);
}

export default DialogInfoFormulas;

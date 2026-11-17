/*
    RPG Paper Maker Copyright (C) 2017-2026 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode, useMemo } from 'react';
import { FaArrowRightFromBracket } from 'react-icons/fa6';
import { Node } from '../../core/Node';
import { CommandUsage } from '../../data/CommandUsages';
import { Model } from '../../Editor';
import '../../styles/CommandUsages.css';
import Flex from '../Flex';
import Loader from '../Loader';
import Tree from '../Tree';
import Dialog, { Z_INDEX_LEVEL } from './Dialog';

type Props = {
	title: string;
	usages: CommandUsage[];
	emptyText: string;
	onClose: () => void;
	onGoTo: (usage: CommandUsage) => void;
	header?: ReactNode;
	zIndex?: Z_INDEX_LEVEL;
	isLoading?: boolean;
};

function DialogCommandUsages({ title, usages, emptyText, onClose, onGoTo, header, zIndex, isLoading = false }: Props) {
	// Resolve Base when the dialog renders, after the Editor module has initialized.
	const CommandUsageRow = useMemo(
		() =>
			class extends Model.Base {
				usage: CommandUsage;

				constructor(id = 0, usage?: CommandUsage) {
					super();
					this.id = id;
					this.usage = usage!;
				}

				static getTreeHeader() {
					return ['variable.usages.map.path', 'object.id', 'variable.usages.object.name', 'command', ''];
				}
			},
		[],
	);

	const list = useMemo(
		() => usages.map((usage, index) => Node.create(new CommandUsageRow(index + 1, usage))),
		[usages, CommandUsageRow],
	);

	return (
		<Dialog title={title} isOpen onClose={onClose} zIndex={zIndex} initialWidth='1100px' initialHeight='600px'>
			<Flex column fillWidth fillHeight spaced className='commandUsages'>
				{header}
				<div className='commandUsagesTree'>
					<Tree
						constructorType={CommandUsageRow}
						list={list}
						cannotAdd
						cannotEdit
						cannotDelete
						cannotDragDrop
						cannotClear
						canBeEmpty
						scrollable
						getText={(node) => {
							const usage = (node.content as InstanceType<typeof CommandUsageRow>).usage;
							return (
								<>
									<Flex one className='textEllipsis'>
										{usage.mapPath}
									</Flex>
									<Flex one>{usage.objectID ?? '-'}</Flex>
									<Flex one className='textEllipsis'>
										{usage.objectName}
									</Flex>
									<Flex one className='textEllipsis'>
										{usage.text ?? usage.command?.toString()}
									</Flex>
									<Flex
										className='commandUsageAction'
										onMouseDown={(event: React.MouseEvent) => event.stopPropagation()}
									>
										<button
											type='button'
											className='commandUsageGoTo'
											title='Go to'
											aria-label='Go to'
											onClick={() => onGoTo(usage)}
										>
											<FaArrowRightFromBracket />
										</button>
									</Flex>
								</>
							);
						}}
					/>
					{isLoading && (
						<div className='commandUsagesLoader'>
							<Loader isLoading alone />
						</div>
					)}
				</div>
				{!isLoading && usages.length === 0 && emptyText}
			</Flex>
		</Dialog>
	);
}

export default DialogCommandUsages;

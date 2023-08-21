/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React from 'react';
import Button from '../Button';
import { AiOutlineFileAdd } from 'react-icons/ai';
import { BiImport } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, triggerImportProject, triggerNewProject } from '../../store';
import ProjectPreview from '../ProjectPreview';
import { MdOutlineAddchart } from 'react-icons/md';
import { FaHandsHelping } from 'react-icons/fa';

function PanelNoProject() {
	const dispatch = useDispatch();
	const projects = useSelector((state: RootState) => state.projects.list);

	const handleNewProject = () => {
		dispatch(triggerNewProject(true));
	};

	const handleImportProject = () => {
		dispatch(triggerImportProject(true));
	};

	const handleDLCs = () => {
		window.open('https://rpg-paper-maker.com/shop/', '_blank');
	};

	const handleContribute = () => {
		window.open('https://rpg-paper-maker.com/contribute/', '_blank');
	};

	const renderProjectsList = () => {
		return projects.length === 0 ? (
			<div className='text-small-detail'>No projects available.</div>
		) : (
			projects.map((project) => <ProjectPreview key={project.name} project={project} />)
		);
	};

	return (
		<div className='flex-column flex-one padding-large'>
			<h2>Recent projects</h2>
			<div className='flex flex-one gap-medium'>
				<div className='flex-column flex-one'>
					<div className='scrollable-flex-one'>{renderProjectsList()}</div>
				</div>
				<div className='flex-zero flex-column gap-small'>
					<Button primary big onClick={handleNewProject}>
						<AiOutlineFileAdd />
						New project...
					</Button>
					<Button big onClick={handleImportProject}>
						<BiImport />
						Import project...
					</Button>
					<Button big onClick={handleDLCs}>
						<MdOutlineAddchart />
						DLCs
					</Button>
					<Button patreon big onClick={handleContribute}>
						<FaHandsHelping />
						Contribute
					</Button>
				</div>
			</div>
		</div>
	);
}

export default PanelNoProject;

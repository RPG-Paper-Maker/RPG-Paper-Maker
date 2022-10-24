/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import React, { useEffect } from 'react';
import DialogNewProject from '../dialogs/DialogNewProject';
import Menu from './Menu';
import MenuItem from './MenuItem';
import SubMenu from './SubMenu';
import { LocalFile } from '../core/LocalFile';
import { Enum } from '../common/Enum';
import { Scene } from '../Editor';
import { Project } from '../core/Project';
import 'rc-dialog/assets/index.css';

type Props = {
    currentProjectName: string,
    setCurrentProjectName: React.Dispatch<React.SetStateAction<string>>
};

function MainMenuBar({ currentProjectName, setCurrentProjectName }: Props) {
    const [dialog, setDialog] = React.useState(<React.Fragment></React.Fragment>);
    const [projectNames, setProjectNames] = React.useState<string[]>([]);

    const loadProjects = async () => {
        let projects = await LocalFile.getFolders(Enum.LocalForage.Projects);
        setProjectNames(projects);
    };

    const newProject = () => {
        let dialog = <DialogNewProject setDialog={setDialog} onAccept={(data: Record<string, any>) => {
            loadProjects();
            openProject(data.projectName);
        }} />;
        setDialog(dialog);
    };

    const openProject = async (name: string) => {
        Project.current = new Project(name);
        await Project.current.load();
        if (Scene.Map.current) {
            Scene.Map.current.close();
        }
        Scene.Map.current = new Scene.Map(1);
        await Scene.Map.current.load();
        setCurrentProjectName(name);
    };

    const closeProject = () => {
        if (Scene.Map.current) {
            Scene.Map.current.close();
            Scene.Map.current = null;
        }
        Project.current = null;
        setCurrentProjectName('');
    };

    const zoomIn = () => {
        if (Scene.Map.current) {
            Scene.Map.current.zoomIn();
        }
    };

    const zoomOut = () => {
        if (Scene.Map.current) {
            Scene.Map.current.zoomOut();
        }
    };

    const save = async () => {
        if (Scene.Map.current) {
            await Scene.Map.current.save();
        }
    };

    const play = () => {
        window.open(window.location.origin + '/play/' + currentProjectName, '_blank')?.focus();
    };

    const isProjectOpened = () => {
        return currentProjectName !== '';
    };

    const keypress = (event: KeyboardEvent) => {
        const states = {
            alt: event.altKey,
            ctrl: event.ctrlKey,
            meta: event.metaKey,
            shift: event.shiftKey,
        };
        //const key = event.key;
        const code = event.code;
        if (states.ctrl && code === 'KeyS' && !isProjectOpened()) {
            event.preventDefault();
            save();
            return false;
        }
    };

    useEffect(() => {
        loadProjects();
        window.addEventListener('keydown', keypress);
        // eslint-disable-next-line
    }, []);

    return (
        <React.Fragment>
            <Menu mode='horizontal'>
                <SubMenu title='File'>
                    <MenuItem onClick={newProject}>New Project...</MenuItem>
                    <SubMenu title='Open existing project...'>
                        {
                            projectNames.map(name => {
                                return <MenuItem key={'project-' + name}
                                    onClick={() => { openProject(name) }}>{name}
                                </MenuItem>;
                            })
                        }
                    </SubMenu>
                    <MenuItem onClick={save} disabled={!isProjectOpened()}>Save</MenuItem>
                    <MenuItem onClick={closeProject} disabled={!isProjectOpened()}>Close</MenuItem>
                </SubMenu>
                <SubMenu title='Edition'>
                    <MenuItem onClick={zoomIn} disabled={!isProjectOpened()}>Zoom in</MenuItem>
                    <MenuItem onClick={zoomOut} disabled={!isProjectOpened()}>Zoom out</MenuItem>
                </SubMenu>
                <SubMenu title='Management'>
                    
                </SubMenu>
                <SubMenu title='Special elements'>
                    
                </SubMenu>
                <SubMenu title='Options'>
                    
                </SubMenu>
                <SubMenu title='Display'>
                    
                </SubMenu>
                <SubMenu title='Test'>
                    <MenuItem onClick={play} disabled={!isProjectOpened()}>Play</MenuItem>
                </SubMenu>
                <SubMenu title='Help'>
                    
                </SubMenu>
            </Menu>
            {dialog}
        </React.Fragment>
    );
}

export default MainMenuBar;
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
import FooterYesNo from './footers/FooterYesNo';
import { Enum } from '../common/Enum';
import { LocalFile } from '../core/LocalFile';
import { Model, Scene } from '../Editor';
import { Project } from '../core/Project';
import DialogBase from './DialogBase';
import 'rc-dialog/assets/index.css';

type Props = {
    setDialog: React.Dispatch<React.SetStateAction<JSX.Element>>
    onAccept: (data: Record<string, any>) => void
};

function DialogNewProject({ setDialog, onAccept }: Props) {
    const [projectName, setProjectName] = React.useState('Project without name');
    const [visibleDialogConfirm, setVisibleDialogConfirm] = React.useState(false);

    const handleOnAccept = async (): Promise<boolean> => {
        if (await checkValidAccept()) {
            await createProject();
            accept();
            return true;
        }
        return false;
    };

    const accept = () => {
        // Send data to parent
        const data = {
            projectName: projectName
        };
        onAccept(data);
    };

    const replaceProject = async () => {
        await LocalFile.removeFolder(Enum.LocalForage.Projects + '/' + projectName)
        await createProject();
        setVisibleDialogConfirm(false);
        accept();
        setDialog(<React.Fragment></React.Fragment>);
    };

    const cancelCreation = () => {
        setVisibleDialogConfirm(false);
    };

    const checkValidAccept: () => Promise<boolean> = async () => {
        let projects = await LocalFile.getFolders(Enum.LocalForage.Projects);
        if (projects.length === 0) {
            await LocalFile.createFolder(Enum.LocalForage.Projects);
        }
        if (projects.find(name => { return name === projectName })) {
            setVisibleDialogConfirm(true);
            return false;
        }
        return true;
    };

    const createProject = async () => {
        if (Scene.Map.current) {
            Scene.Map.current.close();
        }
        Scene.Map.current = null;
        let project = new Project(projectName);
        Project.current = project;
        await LocalFile.createFolder(project.getPath());
        await LocalFile.createFolder(project.getPathContent());
        await LocalFile.createFolder(project.getPathDatas());
        await LocalFile.createFolder(project.getPathMaps());
        await Model.Map.createDefault();
        await Project.current.save();
    };

    return (
        <React.Fragment>
            <DialogBase title='New project...' onAccept={handleOnAccept} setDialog={
                setDialog}>
                <div className='flex-center-vertically'>
                    <p className='label'>Name:</p>
                    <input value={projectName} onChange={e => { setProjectName(e.target.value) }}></input>
                </div>
            </DialogBase>
            <Dialog title='Error' visible={visibleDialogConfirm} footer={<FooterYesNo 
                onYes={replaceProject} onNo={cancelCreation}/>}>
                <p>This project name already exists. Would you like to replace it?</p>
            </Dialog>
        </React.Fragment>
    );
}

export default DialogNewProject;
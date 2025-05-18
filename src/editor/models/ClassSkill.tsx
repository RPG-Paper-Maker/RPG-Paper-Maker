/*
    RPG Paper Maker Copyright (C) 2017-2025 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

import { ReactNode } from 'react';
import { BINDING, BindingType, JSONType } from '../common';
import DialogClassSkill from '../components/dialogs/models/DialogClassSkill';
import { Project } from '../core';
import { Base, DIALOG_OPTIONS } from './Base';

class ClassSkill extends Base {
	public static selectedClassSkills: ClassSkill[];
	public level!: number;

	public static bindings: BindingType[] = [['level', 'l', undefined, BINDING.NUMBER]];

	static getBindings(additionnalBinding: BindingType[]) {
		return [...this.bindings, ...additionnalBinding];
	}

	static getTreeHeader(): string[] {
		return ['skill', 'level'];
	}

	applyDefault(additionnalBinding: BindingType[] = []): void {
		super.applyDefault(ClassSkill.getBindings(additionnalBinding));
		this.level = 1;
	}

	getName(): string {
		return Project.current!.skills.getByID(this.id)?.getName() ?? '';
	}

	getDialog(options: DIALOG_OPTIONS): ReactNode {
		return <DialogClassSkill {...options} />;
	}

	toStrings(): string[] {
		return ['' + this.toString(), '' + this.level];
	}

	copy(classSkill: ClassSkill): void {
		super.copy(classSkill, ClassSkill.getBindings([]));
	}

	read(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.read(json, ClassSkill.getBindings(additionnalBinding));
	}

	write(json: JSONType, additionnalBinding: BindingType[] = []) {
		super.write(json, ClassSkill.getBindings(additionnalBinding));
	}
}

export { ClassSkill };

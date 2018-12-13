/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef DIALOGSYSTEMBATTLECOMMAND_H
#define DIALOGSYSTEMBATTLECOMMAND_H

#include <QDialog>
#include "systembattlecommand.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemBattleCommand
//
//  A dialog used for editing the model of a system battle command.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemBattleCommand;
}

class DialogSystemBattleCommand : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemBattleCommand(SystemBattleCommand& battleCommand,
                                       QWidget *parent = 0);
    ~DialogSystemBattleCommand();
    SystemBattleCommand& battleCommand() const;

private:
    Ui::DialogSystemBattleCommand *ui;
    SystemBattleCommand& m_battleCommand;
    void initialize();

public slots:
    void on_comboBoxSkill_currentIndexChanged(int index);
};

#endif // DIALOGSYSTEMBATTLECOMMAND_H

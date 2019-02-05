/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#ifndef DIALOGKEYBOARDCONTROLS_H
#define DIALOGKEYBOARDCONTROLS_H

#include <QDialog>
#include "enginesettings.h"
#include "project.h"

// -------------------------------------------------------
//
//  CLASS DialogKeyBoardControls
//
//  A dialog used for configuring the keyboard controls.
//
// -------------------------------------------------------

namespace Ui {
class DialogKeyBoardControls;
}

class DialogKeyBoardControls : public QDialog
{
    Q_OBJECT

public:
    explicit DialogKeyBoardControls(Project *project, EngineSettings* settings,
                                    QWidget *parent = 0);
    ~DialogKeyBoardControls();

private:
    Ui::DialogKeyBoardControls *ui;
    KeyBoardDatas* m_gameKeyBoardDatas;
    bool m_canUpdateKey;
    void updateMenuControls();

private slots:
    void on_comboBoxAction_currentIndexChanged(int index);
    void on_comboBoxCancel_currentIndexChanged(int index);
    void on_comboBoxUp_currentIndexChanged(int index);
    void on_comboBoxDown_currentIndexChanged(int index);
    void on_comboBoxLeft_currentIndexChanged(int index);
    void on_comboBoxRight_currentIndexChanged(int index);
    void on_updateJsonGame(SuperListItem*);
};

#endif // DIALOGKEYBOARDCONTROLS_H

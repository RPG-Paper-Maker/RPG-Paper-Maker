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

#ifndef DIALOGSYSTEMMONSTERTROOP_H
#define DIALOGSYSTEMMONSTERTROOP_H

#include <QDialog>
#include "systemmonstertroop.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemMonsterTroop
//
//  A dialog used for editing the model of a system monster troop.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemMonsterTroop;
}

class DialogSystemMonsterTroop : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemMonsterTroop(SystemMonsterTroop& monsterTroop, QWidget
        *parent = nullptr);
    ~DialogSystemMonsterTroop();

private:
    Ui::DialogSystemMonsterTroop *ui;
    SystemMonsterTroop& m_monsterTroop;

    void initialize();

private slots:
    void on_comboBoxMonster_currentIndexChanged(int index);
    void on_spinBoxLevel_valueChanged(int i);
};

#endif // DIALOGSYSTEMMONSTERTROOP_H

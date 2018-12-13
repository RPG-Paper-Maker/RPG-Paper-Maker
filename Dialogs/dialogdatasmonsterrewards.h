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

#ifndef DIALOGDATASMONSTERREWARDS_H
#define DIALOGDATASMONSTERREWARDS_H

#include <QDialog>
#include "systemmonster.h"

// -------------------------------------------------------
//
//  CLASS DialogDatasMonsterRewards
//
//  A dialog used for configuring the rewards on a battle
//  against this monster.
//
// -------------------------------------------------------

namespace Ui {
class DialogDatasMonsterRewards;
}

class DialogDatasMonsterRewards : public QDialog
{
    Q_OBJECT

public:
    explicit DialogDatasMonsterRewards(SystemMonster &monster,
                                       QWidget *parent = 0);
    ~DialogDatasMonsterRewards();

private:
    Ui::DialogDatasMonsterRewards *ui;
    SystemMonster& m_monster;
    void initialize();

private slots:
    void on_spinBoxExp_valueChanged(int i);
};

#endif // DIALOGDATASMONSTERREWARDS_H

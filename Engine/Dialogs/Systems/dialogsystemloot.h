/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef DIALOGSYSTEMLOOT_H
#define DIALOGSYSTEMLOOT_H

#include <QDialog>
#include "systemloot.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemLoot
//
//  A dialog used for editing the model of a system element.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemLoot;
}

class DialogSystemLoot : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemLoot(SystemLoot& loot, QWidget *parent = 0);
    ~DialogSystemLoot();

private:
    Ui::DialogSystemLoot *ui;
    SystemLoot& m_loot;
    void initialize();
    void radioChanged(bool checked, LootKind kind);

private slots:
    void on_radioButtonItemToggled(bool checked);
    void on_radioButtonWeaponToggled(bool checked);
    void on_radioButtonArmorToggled(bool checked);
    void on_comboBoxItemCurrentIndexChanged(int);
    void on_comboBoxWeaponCurrentIndexChanged(int);
    void on_comboBoxArmorCurrentIndexChanged(int);
};

#endif // DIALOGSYSTEMLOOT_H

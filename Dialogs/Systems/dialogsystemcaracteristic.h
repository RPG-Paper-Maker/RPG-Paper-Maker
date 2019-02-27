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

#ifndef DIALOGSYSTEMCARACTERISTIC_H
#define DIALOGSYSTEMCARACTERISTIC_H

#include <QDialog>
#include "systemcaracteristic.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemCaracteristic
//
//  A dialog used for editing the model of a system caracteristic.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemCaracteristic;
}

class DialogSystemCaracteristic : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemCaracteristic(SystemCaracteristic &caracteristic,
        QWidget *parent = nullptr);
    ~DialogSystemCaracteristic();
    SystemCaracteristic & caracteristic() const;

private:
    Ui::DialogSystemCaracteristic *ui;
    SystemCaracteristic &m_caracteristic;

    void initialize();
    void setRadioCharacters();

public slots:
    void on_radioButtonBuff_toggled(bool checked);
    void on_radioButtonEquip_toggled(bool checked);
    void on_radioButtonEquipmentChange_toggled(bool checked);
    void on_radioButtonBeginEquipment_toggled(bool checked);
    void on_radioButtonScript_toggled(bool checked);
    void on_comboBoxIncreaseDecreaseKind_currentIndexChanged(int index);
    void on_comboBoxIncreaseDecrease_currentIndexChanged(int index);
    void on_comboBoxSkillCostAll_currentIndexChanged(int index);
    void on_comboBoxOperation_currentIndexChanged(int index);
    void on_comboBoxUnit_currentIndexChanged(int index);
};

#endif // DIALOGSYSTEMCARACTERISTIC_H

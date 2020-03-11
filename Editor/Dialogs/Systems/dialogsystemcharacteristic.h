/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMCHARACTERISTIC_H
#define DIALOGSYSTEMCHARACTERISTIC_H

#include <QDialog>
#include "systemcharacteristic.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemCharacteristic
//
//  A dialog used for editing the model of a system characteristic.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemCharacteristic;
}

class DialogSystemCharacteristic : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemCharacteristic(SystemCharacteristic &characteristic,
        QWidget *parent = nullptr);
    ~DialogSystemCharacteristic();
    SystemCharacteristic & characteristic() const;

private:
    Ui::DialogSystemCharacteristic *ui;
    SystemCharacteristic &m_characteristic;

    void initialize();
    void setRadioCharacters();
    void uncheckAllRadiosCharacters();
    void translate();

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
    void on_comboBoxEquipAllowForbid_currentIndexChanged(int index);
    void on_comboBoxEquipWeaponArmor_currentIndexChanged(int index);
    void on_comboBoxEquipmentChange_currentIndexChanged(int index);
    void on_comboBoxBeginWeaponArmor_currentIndexChanged(int index);
    void on_beginWeaponArmorNumberChanged(int);
};

#endif // DIALOGSYSTEMCHARACTERISTIC_H

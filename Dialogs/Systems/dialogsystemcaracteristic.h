/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    void uncheckAllRadiosCharacters();

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

#endif // DIALOGSYSTEMCARACTERISTIC_H

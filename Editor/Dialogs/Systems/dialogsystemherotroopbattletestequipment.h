/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMHEROTROOPBATTLETESTEQUIPMENT_H
#define DIALOGSYSTEMHEROTROOPBATTLETESTEQUIPMENT_H

#include <QDialog>
#include "systemherotroopbattletestequipment.h"

namespace Ui {
class DialogSystemHeroTroopBattleTestEquipment;
}

class DialogSystemHeroTroopBattleTestEquipment : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemHeroTroopBattleTestEquipment(SystemHeroTroopBattleTestEquipment
        &equipment, QWidget *parent = nullptr);
    ~DialogSystemHeroTroopBattleTestEquipment();

    void initialize();
    void translate();

private:
    Ui::DialogSystemHeroTroopBattleTestEquipment *ui;
    SystemHeroTroopBattleTestEquipment &m_equipment;

public slots:
    void on_radioButtonNone_toggled(bool checked);
    void on_radioButtonWeapon_toggled(bool checked);
    void on_radioButtonArmor_toggled(bool checked);
    void on_comboBoxWeapon_currentIndexChanged(int index);
    void on_comboBoxArmor_currentIndexChanged(int index);
};

#endif // DIALOGSYSTEMHEROTROOPBATTLETESTEQUIPMENT_H

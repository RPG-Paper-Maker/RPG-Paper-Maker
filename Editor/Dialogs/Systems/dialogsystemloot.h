/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
};

#endif // DIALOGSYSTEMLOOT_H

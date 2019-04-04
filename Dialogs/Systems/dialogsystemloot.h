/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

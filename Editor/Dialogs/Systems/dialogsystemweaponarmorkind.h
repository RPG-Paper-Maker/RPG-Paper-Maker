/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMWEAPONARMORKIND_H
#define DIALOGSYSTEMWEAPONARMORKIND_H

#include <QDialog>
#include "systemweaponarmorkind.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemWeaponArmorKind
//
//  A dialog used for editing the model of a system weapon armor kind.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemWeaponArmorKind;
}

class DialogSystemWeaponArmorKind : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemWeaponArmorKind(SystemWeaponArmorKind& weaponArmorKind,
                                         QWidget *parent = 0);
    ~DialogSystemWeaponArmorKind();

private:
    Ui::DialogSystemWeaponArmorKind *ui;
    SystemWeaponArmorKind& m_weaponArmorKind;
    void initialize();

public slots:
    virtual void accept();
};

#endif // DIALOGSYSTEMWEAPONARMORKIND_H

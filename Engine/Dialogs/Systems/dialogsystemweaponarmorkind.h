/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

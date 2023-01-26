/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef DIALOGSYSTEMCOMMANDITEMPRICE_H
#define DIALOGSYSTEMCOMMANDITEMPRICE_H

#include <QDialog>
#include "systemcommanditemprice.h"

// -------------------------------------------------------
//
//  CLASS DialogSystemCommandItemPrice
//
//  A dialog used for editing the model of a system command item price.
//
// -------------------------------------------------------

namespace Ui {
class DialogSystemCommandItemPrice;
}

class DialogSystemCommandItemPrice : public QDialog
{
    Q_OBJECT

public:
    explicit DialogSystemCommandItemPrice(SystemCommandItemPrice& itemPrice,
        QWidget *parent = nullptr);
    ~DialogSystemCommandItemPrice();

    void initialize();
    void translate();

private:
    Ui::DialogSystemCommandItemPrice *ui;
    SystemCommandItemPrice &m_itemPrice;

public slots:
    void on_radioButtonItemID_toggled(bool checked);
    void on_radioButtonWeaponID_toggled(bool checked);
    void on_radioButtonArmorID_toggled(bool checked);
    void on_radioButtonPriceSpecific_toggled(bool checked);
    void on_radioButtonStockSpecific_toggled(bool checked);
};

#endif // DIALOGSYSTEMCOMMANDITEMPRICE_H

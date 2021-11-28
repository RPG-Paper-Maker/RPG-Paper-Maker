/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcurrency.h"
#include "dialogsystemcurrency.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCurrency::SystemCurrency() :
    SystemCurrency(1, "", -1)
{

}

SystemCurrency::SystemCurrency(int i, QString name, int pictureID, int pictureIndexX,
    int pictureIndexY) :
    SystemIcon(i, name, pictureID, pictureIndexX, pictureIndexY)
{

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemCurrency::openDialog() {
    SystemCurrency currency;
    currency.setCopy(*this);
    DialogSystemCurrency dialog(currency);

    if (dialog.exec() == QDialog::Accepted) {
        setCopy(currency);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem* SystemCurrency::createCopy() const{
    SystemCurrency* super = new SystemCurrency;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCurrency::setCopy(const SuperListItem &super) {
    SystemIcon::setCopy(super);
}

// -------------------------------------------------------

void SystemCurrency::read(const QJsonObject &json){
    SystemIcon::read(json);
}

// -------------------------------------------------------

void SystemCurrency::write(QJsonObject &json) const{
    SystemIcon::write(json);
}

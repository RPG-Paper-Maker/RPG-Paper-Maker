/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemcurrency.h"
#include "dialogsystemcurrency.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCurrency::SystemCurrency() : SystemCurrency(1, new LangsTranslation, -1)
{

}

SystemCurrency::SystemCurrency(int i, LangsTranslation* names, int pictureID) :
    SystemIcon(i, names, pictureID)
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

void SystemCurrency::setCopy(const SystemCurrency& super){
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

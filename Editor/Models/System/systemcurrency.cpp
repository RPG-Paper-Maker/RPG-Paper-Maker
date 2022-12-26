/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
    int pictureIndexY, PrimitiveValue *displayInMenu) :
    SystemIcon(i, name, pictureID, pictureIndexX, pictureIndexY),
    m_displayInMenu(displayInMenu)
{

}

SystemCurrency::~SystemCurrency()
{
    delete m_displayInMenu;
}

PrimitiveValue * SystemCurrency::displayInMenu() const
{
    return m_displayInMenu;
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
    const SystemCurrency *currency = reinterpret_cast<const SystemCurrency *>(&super);
    SystemIcon::setCopy(super);
    m_displayInMenu->setCopy(*currency->displayInMenu());
}

// -------------------------------------------------------

void SystemCurrency::read(const QJsonObject &json){
    SystemIcon::read(json);
    if (json.contains("dim"))
    {
        m_displayInMenu->read(json["dim"].toObject());
    }
}

// -------------------------------------------------------

void SystemCurrency::write(QJsonObject &json) const{
    SystemIcon::write(json);
    if (m_displayInMenu->kind() != PrimitiveValueKind::Switch || !m_displayInMenu->switchValue())
    {
        QJsonObject obj;
        m_displayInMenu->write(obj);
        json["dim"] = obj;
    }
}

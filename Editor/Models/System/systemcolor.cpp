/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemcolor.h"
#include "systemcolor.h"

const QString SystemColor::JSON_R = "r";
const QString SystemColor::JSON_G = "g";
const QString SystemColor::JSON_B = "b";
const QString SystemColor::JSON_A = "a";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemColor::SystemColor() : SuperListItem() {

}

SystemColor::SystemColor(int i, QString n, int r, int g, int b, int a) :
    SuperListItem (i, n),
    m_color(r, g, b, a)
{

}

SystemColor::~SystemColor() {

}

QColor SystemColor::color() const {
    return m_color;
}

void SystemColor::setColor(QColor& color) {
    m_color = color;
}


// -------------------------------------------------------
//
//  VIRTUAL METHODS
//
// -------------------------------------------------------

bool SystemColor::openDialog() {
    SystemColor color;
    color.setCopy(*this);
    DialogSystemColor dialog(color);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(color);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemColor::createCopy() const {
    SystemColor *super = new SystemColor;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemColor::setCopy(const SuperListItem &super) {
    const SystemColor *color;

    SuperListItem::setCopy(super);
    color = reinterpret_cast<const SystemColor *>(&super);
    m_color = color->m_color;
}

// -------------------------------------------------------

void SystemColor::getIcon(QIcon &icon) {
    QPixmap pix(24, 24);

    pix.fill(m_color);
    icon = QIcon(pix);
}

// -------------------------------------------------------

void SystemColor::read(const QJsonObject &json) {
    SuperListItem::read(json);

    m_color = QColor(json[JSON_R].toInt(), json[JSON_G].toInt(), json[JSON_B]
        .toInt(), json[JSON_A].toInt());
}

// -------------------------------------------------------

void SystemColor::write(QJsonObject &json) const{
    SuperListItem::write(json);

    json[JSON_R] = m_color.red();
    json[JSON_G] = m_color.green();
    json[JSON_B] = m_color.blue();
    json[JSON_A] = m_color.alpha();
}

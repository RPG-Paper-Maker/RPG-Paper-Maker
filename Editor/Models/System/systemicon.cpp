/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemicon.h"

const QString SystemIcon::JSON_PICTURE_ID = "pid";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemIcon::SystemIcon() : SystemIcon(1, "", -1)
{

}

SystemIcon::SystemIcon(int i, QString name, int pictureID) :
    SystemTranslatable(i, name),
    m_pictureID(pictureID)
{

}

SystemIcon::~SystemIcon(){

}

int SystemIcon::pictureID() const {
    return m_pictureID;
}

void SystemIcon::setPictureID(int id) {
    m_pictureID = id;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemIcon::setCopy(const SuperListItem &super) {
    const SystemIcon *icon;

    SystemTranslatable::setCopy(super);

    icon = reinterpret_cast<const SystemIcon *>(&super);
    m_pictureID = icon->m_pictureID;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemIcon::read(const QJsonObject &json){
    SystemTranslatable::read(json);

    m_pictureID = json[JSON_PICTURE_ID].toInt();
}

// -------------------------------------------------------

void SystemIcon::write(QJsonObject &json) const{
    SystemTranslatable::write(json);

    json[JSON_PICTURE_ID] = m_pictureID;
}

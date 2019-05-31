/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemicon.h"

const QString SystemIcon::JSON_PICTURE_ID = "pid";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemIcon::SystemIcon() : SystemIcon(1, new LangsTranslation, -1)
{

}

SystemIcon::SystemIcon(int i, LangsTranslation *names, int pictureID) :
    SystemLang(i, names),
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

void SystemIcon::setCopy(const SystemIcon& icon){
    SystemLang::setCopy(icon);

    m_pictureID = icon.m_pictureID;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemIcon::read(const QJsonObject &json){
    SystemLang::read(json);

    m_pictureID = json[JSON_PICTURE_ID].toInt();
}

// -------------------------------------------------------

void SystemIcon::write(QJsonObject &json) const{
    SystemLang::write(json);

    json[JSON_PICTURE_ID] = m_pictureID;
}

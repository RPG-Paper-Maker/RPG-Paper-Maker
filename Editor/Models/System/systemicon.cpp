/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemicon.h"

const QString SystemIcon::JSON_PICTURE_ID = "pid";
const QString SystemIcon::JSON_PICTURE_INDEX_X = "pictureIndexX";
const QString SystemIcon::JSON_PICTURE_INDEX_Y = "pictureIndexY";
const int SystemIcon::DEFAULT_PICTURE_ID = -1;
const int SystemIcon::DEFAULT_PICTURE_INDEX_X = 0;
const int SystemIcon::DEFAULT_PICTURE_INDEX_Y = 0;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemIcon::SystemIcon(int i, QString name, int pictureID, int pictureIndexX, int
    pictureIndexY) :
    SystemTranslatable(i, name),
    m_pictureID(pictureID),
    m_pictureIndexX(pictureIndexX),
    m_pictureIndexY(pictureIndexY)
{

}

SystemIcon::~SystemIcon()
{

}

int SystemIcon::pictureID() const
{
    return m_pictureID;
}

void SystemIcon::setPictureID(int id)
{
    m_pictureID = id;
}

int SystemIcon::pictureIndexX() const
{
    return m_pictureIndexX;
}

void SystemIcon::setPictureIndexX(int pictureIndexX)
{
    m_pictureIndexX = pictureIndexX;
}

int SystemIcon::pictureIndexY() const
{
    return m_pictureIndexY;
}

void SystemIcon::setPictureIndexY(int pictureIndexY)
{
    m_pictureIndexY = pictureIndexY;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemIcon::setCopy(const SuperListItem &super)
{
    SystemTranslatable::setCopy(super);
    const SystemIcon *icon = reinterpret_cast<const SystemIcon *>(&super);
    m_pictureID = icon->m_pictureID;
    m_pictureIndexX = icon->m_pictureIndexX;
    m_pictureIndexY = icon->m_pictureIndexY;
}

// -------------------------------------------------------

void SystemIcon::read(const QJsonObject &json)
{
    SystemTranslatable::read(json);
    m_pictureID = json[JSON_PICTURE_ID].toInt();
    if (json.contains(JSON_PICTURE_INDEX_X))
    {
        m_pictureIndexX = json[JSON_PICTURE_INDEX_X].toInt();
    }
    if (json.contains(JSON_PICTURE_INDEX_Y))
    {
        m_pictureIndexY = json[JSON_PICTURE_INDEX_Y].toInt();
    }
}

// -------------------------------------------------------

void SystemIcon::write(QJsonObject &json) const
{
    SystemTranslatable::write(json);
    json[JSON_PICTURE_ID] = m_pictureID;
    if (m_pictureIndexX != DEFAULT_PICTURE_INDEX_X)
    {
        json[JSON_PICTURE_INDEX_X] = m_pictureIndexX;
    }
    if (m_pictureIndexY != DEFAULT_PICTURE_INDEX_Y)
    {
        json[JSON_PICTURE_INDEX_Y] = m_pictureIndexY;
    }
}

/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMICON_H
#define SYSTEMICON_H

#include <QMetaType>
#include "systemtranslatable.h"

// -------------------------------------------------------
//
//  CLASS SystemIcon
//
//  A particulary icon (ressources).
//
// -------------------------------------------------------

class SystemIcon : public SystemTranslatable
{
public:
    static const QString JSON_PICTURE_ID;
    static const QString JSON_PICTURE_INDEX_X;
    static const QString JSON_PICTURE_INDEX_Y;
    static const int DEFAULT_PICTURE_ID;
    static const int DEFAULT_PICTURE_INDEX_X;
    static const int DEFAULT_PICTURE_INDEX_Y;

    SystemIcon(int i = DEFAULT_ID, QString name = DEFAULT_NAME, int pictureID =
        DEFAULT_PICTURE_ID, int pictureIndexX = DEFAULT_PICTURE_INDEX_X, int
        pictureIndexY = DEFAULT_PICTURE_INDEX_Y);
    virtual ~SystemIcon();
    int pictureID() const;
    void setPictureID(int id);
    int pictureIndexX() const;
    void setPictureIndexX(int pictureIndexX);
    int pictureIndexY() const;
    void setPictureIndexY(int pictureIndexY);

    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_pictureID;
    int m_pictureIndexX;
    int m_pictureIndexY;
};

Q_DECLARE_METATYPE(SystemIcon)

#endif // SYSTEMICON_H

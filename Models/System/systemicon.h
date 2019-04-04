/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMICON_H
#define SYSTEMICON_H

#include <QMetaType>
#include "systemlang.h"

// -------------------------------------------------------
//
//  CLASS SystemIcon
//
//  A particulary icon (ressources).
//
// -------------------------------------------------------

class SystemIcon : public SystemLang
{
public:
    static const QString JSON_PICTURE_ID;

    SystemIcon();
    SystemIcon(int i, LangsTranslation* names, int pictureID);
    virtual ~SystemIcon();
    int pictureID() const;
    void setPictureID(int id);

    virtual void setCopy(const SystemIcon& icon);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_pictureID;
};

Q_DECLARE_METATYPE(SystemIcon)

#endif // SYSTEMICON_H

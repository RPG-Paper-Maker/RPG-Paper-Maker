/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMSPECIALELEMENT_H
#define SYSTEMSPECIALELEMENT_H

#include "superlistitem.h"
#include "systempicture.h"

// -------------------------------------------------------
//
//  CLASS SystemSpecialElement
//
//  A particulary special element.
//
// -------------------------------------------------------

class SystemSpecialElement : public SuperListItem
{
public:
    SystemSpecialElement();
    SystemSpecialElement(int i, QString n, int pictureId);
    virtual ~SystemSpecialElement();
    virtual SystemPicture* picture() const;
    void setPictureID(int id);

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemSpecialElement &super);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SystemPicture* pictureByKind(PictureKind kind) const;

    int m_pictureID;
};

Q_DECLARE_METATYPE(SystemSpecialElement)

#endif // SYSTEMSPECIALELEMENT_H

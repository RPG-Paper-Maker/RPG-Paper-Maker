/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMMAPOBJECT_H
#define SYSTEMMAPOBJECT_H

#include "superlistitem.h"
#include "position3d.h"

// -------------------------------------------------------
//
//  CLASS SystemMapObject
//
//  A particulary map object (local).
//
// -------------------------------------------------------

class SystemMapObject : public SuperListItem
{
public:
    SystemMapObject();
    SystemMapObject(int i, QString n, Position3D& position);
    virtual ~SystemMapObject();
    Position3D position() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    Position3D m_position;
};

#endif // SYSTEMMAPOBJECT_H

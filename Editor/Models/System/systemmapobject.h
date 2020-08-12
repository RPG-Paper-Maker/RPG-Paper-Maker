/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

Q_DECLARE_METATYPE(SystemMapObject)

#endif // SYSTEMMAPOBJECT_H

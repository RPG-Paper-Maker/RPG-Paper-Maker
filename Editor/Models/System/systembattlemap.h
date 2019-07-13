/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMBATTLEMAP_H
#define SYSTEMBATTLEMAP_H

#include <QStandardItemModel>
#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"
#include "position3d.h"

// -------------------------------------------------------
//
//  CLASS SystemBattleMap
//
//  A particulary battle map position.
//
// -------------------------------------------------------

class SystemBattleMap : public SuperListItem
{
public:
    SystemBattleMap();
    SystemBattleMap(int i, QString name);
    SystemBattleMap(int i, QString name, int idMap, Position3D position);
    virtual ~SystemBattleMap();
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemBattleMap &battleMap);
    virtual QString toString() const;

    static const QString jsonIdMap;
    static const QString jsonPosition;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_idMap;
    Position3D m_position;
};

Q_DECLARE_METATYPE(SystemBattleMap)

#endif // SYSTEMATTLEMAP_H

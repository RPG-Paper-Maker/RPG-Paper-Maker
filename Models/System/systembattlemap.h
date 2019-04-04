/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

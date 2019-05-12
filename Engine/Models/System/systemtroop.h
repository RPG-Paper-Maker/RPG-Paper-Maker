/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMTROOP_H
#define SYSTEMTROOP_H

#include <QStandardItemModel>
#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemTroop
//
//  A particulary troop (datas).
//
// -------------------------------------------------------

class SystemTroop : public SuperListItem
{
public:
    SystemTroop();
    SystemTroop(int i, QString n, QStandardItemModel *monstersList);
    virtual ~SystemTroop();
    QStandardItemModel* monstersList() const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemTroop &troop);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QStandardItemModel *m_monstersList;
};

Q_DECLARE_METATYPE(SystemTroop)

#endif // SYSTEMTROOP_H

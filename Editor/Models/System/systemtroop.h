/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    static const QString JSON_MONSTERS_LIST;
    static const QString JSON_REACTIONS;

    SystemTroop();
    SystemTroop(int i, QString n, QStandardItemModel *monstersList = new
        QStandardItemModel, QStandardItemModel *reactions = new
        QStandardItemModel);
    virtual ~SystemTroop();
    QStandardItemModel * monstersList() const;
    QStandardItemModel * reactions() const;

    void initializeHeaders();

    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QStandardItemModel *m_monstersList;
    QStandardItemModel *m_reactions;
};

Q_DECLARE_METATYPE(SystemTroop)

#endif // SYSTEMTROOP_H

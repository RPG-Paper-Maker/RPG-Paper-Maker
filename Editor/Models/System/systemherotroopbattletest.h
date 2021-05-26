/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMHEROTROOPBATTLETEST_H
#define SYSTEMHEROTROOPBATTLETEST_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemHeroTroopBattleTest
//
//  A particular hero in option troop battle test.
//
// -------------------------------------------------------

class SystemHeroTroopBattleTest : public SuperListItem
{
public:
    SystemHeroTroopBattleTest();
    virtual ~SystemHeroTroopBattleTest();
    int heroID() const;
    void setHeroID(int heroID);
    int level() const;
    void setLevel(int level);
    QStandardItemModel * modelEquipments() const;

    virtual QString name() const;

protected:
    int m_heroID;
    int m_level;
    QStandardItemModel *m_modelEquipments;
};

Q_DECLARE_METATYPE(SystemHeroTroopBattleTest)

#endif // SYSTEMHEROTROOPBATTLETEST_H

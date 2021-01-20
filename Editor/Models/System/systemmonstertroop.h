/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMMONSTERTROOP_H
#define SYSTEMMONSTERTROOP_H

#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemMonsterTroop
//
//  A particulary monster troop (datas).
//
// -------------------------------------------------------

class SystemMonsterTroop : public SuperListItem
{
public:
    SystemMonsterTroop();
    SystemMonsterTroop(int i, QString n, int level);
    virtual ~SystemMonsterTroop();
    int level() const;
    void setLevel(int l);

    void updateName();

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_level;
};

Q_DECLARE_METATYPE(SystemMonsterTroop)

#endif // SYSTEMMONSTERTROOP_H

/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    virtual void setCopy(const SystemMonsterTroop &monsterTroop);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_level;
};

Q_DECLARE_METATYPE(SystemMonsterTroop)

#endif // SYSTEMMONSTERTROOP_H

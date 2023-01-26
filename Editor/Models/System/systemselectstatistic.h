/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSELECTSTATISTIC_H
#define SYSTEMSELECTSTATISTIC_H

#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemSelectStatistic
//
//  A particulary select statistic (datas). Used for heroes statistic to display.
//
// -------------------------------------------------------

class SystemSelectStatistic : public SuperListItem
{
public:
    static const QString JSON_STATISTIC_ID;

    SystemSelectStatistic();
    SystemSelectStatistic(int i, QString name, PrimitiveValue *statisticID = new
        PrimitiveValue(PrimitiveValueKind::DataBase, 1));
    virtual ~SystemSelectStatistic();
    PrimitiveValue * statisticID() const;

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_statisticID;
};

#endif // SYSTEMSELECTSTATISTIC_H

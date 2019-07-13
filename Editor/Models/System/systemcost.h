/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCOST_H
#define SYSTEMCOST_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"
#include "damageskind.h"

// -------------------------------------------------------
//
//  CLASS SystemCost
//
//  A particulary cost (datas).
//
// -------------------------------------------------------

class SystemCost : public SuperListItem
{
public:
    static const QString JSON_KIND;
    static const QString JSON_STATISTIC_ID;
    static const QString JSON_CURRENCY_ID;
    static const QString JSON_VARIABLE_ID;
    static const QString JSON_VALUE_FORMULA;

    SystemCost();
    SystemCost(DamagesKind kind, PrimitiveValue *statisticID, PrimitiveValue
        *currencyID, int variableID, PrimitiveValue *valueFormula);
    virtual ~SystemCost();
    SuperListItem * kind() const;
    PrimitiveValue * statisticID() const;
    PrimitiveValue * currencyID() const;
    SuperListItem * variableID() const;
    PrimitiveValue * valueFormula() const;

    static SystemCost * createStat(int stat, int nb);
    static SystemCost * createMP(int nb);
    static SystemCost * createTP(int nb);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemCost &cost);
    virtual QString toString() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SuperListItem *m_kind;
    PrimitiveValue *m_statisticID;
    PrimitiveValue *m_currencyID;
    SuperListItem *m_variableID;
    PrimitiveValue *m_valueFormula;
};

Q_DECLARE_METATYPE(SystemCost)

#endif // SYSTEMCOST_H

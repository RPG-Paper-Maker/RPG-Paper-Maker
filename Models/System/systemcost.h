/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
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

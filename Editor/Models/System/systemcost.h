/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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

    SystemCost(DamagesKind kind = DamagesKind::Stat, PrimitiveValue
        *statisticID = new PrimitiveValue(PrimitiveValueKind::DataBase, 1),
        PrimitiveValue *currencyID = new PrimitiveValue(PrimitiveValueKind
        ::DataBase, 1), int variableID = 1, PrimitiveValue *valueFormula = new
        PrimitiveValue(QString()));
    virtual ~SystemCost();
    SuperListItem * kind() const;
    PrimitiveValue * statisticID() const;
    PrimitiveValue * currencyID() const;
    SuperListItem * variableID() const;
    PrimitiveValue * valueFormula() const;

    static QString toStringPrice(QStandardItemModel *model);
    static SystemCost * createStat(int stat, int nb);
    static SystemCost * createMP(int nb);
    static SystemCost * createTP(int nb);

    void initialize(const EventCommand *command, int &i);
    void getCommand(QVector<QString> &command);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
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

/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMPROGRESSIONTABLE_H
#define SYSTEMPROGRESSIONTABLE_H

#include <QMetaType>
#include "superlistitem.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemRewardTable
//
//  A particulary reward table for monsters (datas).
//
// -------------------------------------------------------

class SystemProgressionTable : public SuperListItem
{
public:
    static const QString JSON_INITIAL_VALUE;
    static const QString JSON_FINAL_VALUE;
    static const QString JSON_EQUATION;
    static const QString JSON_TABLE;

    SystemProgressionTable();
    SystemProgressionTable(PrimitiveValue *initialValue, PrimitiveValue
        *finalValue, int equation);
    virtual ~SystemProgressionTable();
    PrimitiveValue * initialValue() const;
    PrimitiveValue * finalValue() const;
    int equation() const;
    void setEquation(int i);
    QHash<int, int> * table();

    static int easing(int e, double x, double start, double change, double
        duration);
    static double easingDouble(int e, double x, double start, double change,
        double duration);
    static double easingLinear(double x, double start, double change, double
        duration);
    static double easingQuadraticIn(double x, double start, double change,
        double duration);
    static double easingQuadraticOut(double x, double start, double change,
        double duration);
    static double easingCubicIn(double x, double start, double change, double
        duration);
    static double easingCubicOut(double x, double start, double change, double
        duration);
    static double easingQuarticIn(double x, double start, double change, double
        duration);
    static double easingQuarticOut(double x, double start, double change, double
        duration);
    static double easingQuinticIn(double x, double start, double change,
        double duration);
    static double easingQuinticOut(double x, double start, double change,
        double duration);

    void reset();
    bool isDefault() const;

    virtual SuperListItem * createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_initialValue;
    PrimitiveValue *m_finalValue;
    int m_equation;
    QHash<int, int> m_table;
};

Q_DECLARE_METATYPE(SystemProgressionTable)

#endif // SYSTEMPROGRESSIONTABLE_H

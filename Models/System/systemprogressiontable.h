/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

    void reset();
    bool isDefault() const;

    void setCopy(const SystemProgressionTable& progression);
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

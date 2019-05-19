/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMSTATISTICPROGRESSION_H
#define SYSTEMSTATISTICPROGRESSION_H

#include <QMetaType>
#include "superlistitem.h"
#include "systemprogressiontable.h"
#include "primitivevalue.h"

// -------------------------------------------------------
//
//  CLASS SystemStatisticProgression
//
//  A particulary statistic progression (datas).
//
// -------------------------------------------------------

class SystemStatisticProgression : public SuperListItem
{
public:
    static const QString JSON_MAX;
    static const QString JSON_ISFIX;
    static const QString JSON_TABLE;
    static const QString JSON_RANDOM;
    static const QString JSON_FORMULA;

    SystemStatisticProgression();
    SystemStatisticProgression(int i, QString n, PrimitiveValue *max, bool isFix,
        SystemProgressionTable *table, PrimitiveValue *random, PrimitiveValue
        *formula);
    virtual ~SystemStatisticProgression();
    PrimitiveValue * max() const;
    bool isFix() const;
    void setIsFix(bool f);
    SystemProgressionTable * table() const;
    PrimitiveValue * random() const;
    PrimitiveValue * formula() const;

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemStatisticProgression &
                         statisticProgression);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PrimitiveValue *m_max;
    bool m_isFix;
    SystemProgressionTable *m_table;
    PrimitiveValue *m_random;
    PrimitiveValue *m_formula;
};

Q_DECLARE_METATYPE(SystemStatisticProgression)

#endif // SYSTEMSTATISTICPROGRESSION_H

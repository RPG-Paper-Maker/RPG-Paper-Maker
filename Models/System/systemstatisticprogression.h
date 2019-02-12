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

#ifndef SYSTEMSTATISTICPROGRESSION_H
#define SYSTEMSTATISTICPROGRESSION_H

#include <QMetaType>
#include "superlistitem.h"
#include "systemprogressiontable.h"

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
    SystemStatisticProgression(int i, QString n, int max, bool isFix,
        SystemProgressionTable *table, int random, QString formula);
    virtual ~SystemStatisticProgression();
    int max() const;
    void setMax(int m);
    bool isFix() const;
    void setIsFix(bool f);
    SystemProgressionTable * table() const;
    int random() const;
    void setRandom(int r);
    QString formula() const;
    void setFormula(QString f);

    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemStatisticProgression &
                         statisticProgression);
    virtual QList<QStandardItem*> getModelRow() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_max;
    bool m_isFix;
    SystemProgressionTable *m_table;
    int m_random;
    QString m_formula;
};

Q_DECLARE_METATYPE(SystemStatisticProgression)

#endif // SYSTEMSTATISTICPROGRESSION_H

/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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
    SystemStatisticProgression();
    SystemStatisticProgression(int i, QString n, int init, int final,
                               QVector<int>* curve);
    virtual ~SystemStatisticProgression();
    int initialValue() const;
    void setInitialValue(int i);
    int finalValue() const;
    void setFinalValue(int i);
    QVector<int>* curve() const;
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemStatisticProgression &
                         statisticProgression);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_initialValue;
    int m_finalValue;
    QVector<int>* m_curve;
};

Q_DECLARE_METATYPE(SystemStatisticProgression)

#endif // SYSTEMSTATISTICPROGRESSION_H

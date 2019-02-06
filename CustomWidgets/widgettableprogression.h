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

#ifndef WIDGETTABLEPROGRESSION_H
#define WIDGETTABLEPROGRESSION_H

#include <QTableWidget>
#include <QtCharts>
#include "systemprogressiontable.h"

class WidgetTableProgression : public QTableWidget
{
    Q_OBJECT
public:
    static const QString NAME_LEVEL;
    static const QColor EDITED_COLOR;
    static const QColor SUB_EDITED_COLOR;

    explicit WidgetTableProgression(QWidget *parent = nullptr);
    ~WidgetTableProgression();
    void setEditable(bool b);
    QHash<int, int> * table();
    void setTable(QHash<int, int> *table);
    WidgetTableProgression * totalWidget() const;
    void setTotalWidget(WidgetTableProgression *w);
    void setEditedColor(const QColor &color);

    void initialize(int rows, QString progression);
    void updateWithBaseInflation(int base, double inflation, int maxLevel,
        QHash<int, int> *subTable = nullptr);
    void updateWithEasing(SystemProgressionTable* progression, QChartView *chartView,
        int finalLevel);
    int easingLinear(double x, int start, int change, int duration);
    int easingQuadraticIn(double x, int start, int change, int duration);
    int easingQuadraticOut(double x, int start, int change, int duration);
    int easingCubicIn(double x, int start, int change, int duration);
    int easingCubicOut(double x, int start, int change, int duration);
    int easingQuarticIn(double x, int start, int change, int duration);
    int easingQuarticOut(double x, int start, int change, int duration);
    int easingQuinticIn(double x, int start, int change, int duration);
    int easingQuinticOut(double x, int start, int change, int duration);
    void updateTotal();

protected:
    bool m_completing;
    QHash<int, int> *m_table;
    WidgetTableProgression *m_totalWidget;
    QColor m_editedColor;

public slots:
    void on_cellChanged(int row, int column);
};

#endif // WIDGETTABLEPROGRESSION_H

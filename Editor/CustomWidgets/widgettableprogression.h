/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    void deleteLines();

protected:
    bool m_completing;
    QHash<int, int> *m_table;
    WidgetTableProgression *m_totalWidget;
    QColor m_editedColor;
    QLineSeries *m_line;
    QLineSeries *m_horizontalLine;

public slots:
    void on_cellChanged(int row, int column);
};

#endif // WIDGETTABLEPROGRESSION_H

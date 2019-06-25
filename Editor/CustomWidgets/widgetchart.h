/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef WIDGETCHART_H
#define WIDGETCHART_H

#include <QFrame>
#include <QPen>

// -------------------------------------------------------
//
//  CLASS WidgetChart
//
//  Widget used for drawing charts.
//
// -------------------------------------------------------

class WidgetChart : public QFrame
{
    Q_OBJECT

public:
    explicit WidgetChart(QWidget *parent = nullptr);
    virtual ~WidgetChart();
    void initialize(QVector<QPoint> &line, QLine &horizontalLine, QPen &pen,
        QLinearGradient &gradient, int xMin, int xMax, int xTick, int yMin, int
        yMax, int yTick);
    void updateScale();

protected:
    QVector<QPoint> m_originalLine;
    QLine m_originalHorizontalLine;
    QVector<QPointF> m_line;
    QLineF m_horizontalLine;
    QPen m_pen;
    QPen m_penGrey;
    QPen m_penText;
    QLinearGradient m_gradient;
    QRect m_rectGraph;
    QVector<QPointF> m_linesX;
    QVector<QPointF> m_linesY;
    int m_xMin;
    int m_xMax;
    int m_xTick;
    int m_yMin;
    int m_yMax;
    int m_yTick;

    virtual void paintEvent(QPaintEvent *event);
};

#endif // WIDGETCHART_H

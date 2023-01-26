/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QFrame>
#include <QPainter>
#include <QPainterPath>
#include "widgetchart.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetChart::WidgetChart(QWidget *parent) :
    QFrame(parent),
    m_penGrey(Qt::darkGray, 1),
    m_penText(RPM::COLOR_ALMOST_BLACK)
{

}

WidgetChart::~WidgetChart() {

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetChart::initialize(QVector<QPoint> &line, QLine &horizontalLine, QPen
    &pen, QLinearGradient &gradient, int xMin, int xMax, int xTick, int yMin,
    int yMax, int yTick)
{
    m_originalLine = line;
    m_originalHorizontalLine = horizontalLine;
    m_pen = pen;
    m_gradient = gradient;
    m_xMin = xMin;
    m_xMax = xMax;
    m_xTick = xTick;
    m_yMin = yMin;
    m_yMax = yMax;
    m_yTick = yTick;

    this->repaint();
}

// -------------------------------------------------------

void WidgetChart::updateScale() {
    QPoint point;
    double coefX, coefY;
    int i, l, offsetX, offsetY, x, y;

    // Curve line
    offsetX = 100;
    offsetY = 50;
    coefX = static_cast<double>(this->width() - offsetX) / (m_xMax - m_xMin + 1);
    coefY = static_cast<double>(this->height() - offsetY) / (m_yMax - m_yMin + 1);
    m_line.clear();
    for (i = 0, l = m_originalLine.size(); i < l; i++) {
        point = m_originalLine.at(i);
        if (point.x() >= m_xMin) {
            m_line << QPointF(point.x() * coefX + (offsetX / 2), this->height() -
                (point.y() * coefY) - (offsetY / 2));
        }
    }

    // Horizontal line
    point = m_originalHorizontalLine.p1();
    m_horizontalLine.setP1(QPointF(point.x() * coefX + (offsetX / 2),
        this->height() - (point.y() * coefY) - (offsetY / 2)));
    point = m_originalHorizontalLine.p2();
    m_horizontalLine.setP2(QPointF(point.x() * coefX + (offsetX / 2),
        this->height() - (point.y() * coefY) - (offsetY / 2)));

    // Rect graph
    m_rectGraph.setX(offsetX / 2);
    m_rectGraph.setY(offsetY / 2);
    m_rectGraph.setWidth(this->width() - offsetX);
    m_rectGraph.setHeight(this->height() - offsetY);

    // Axes lines
    for (i = 1; i <= m_xTick; i++) {
        x = (offsetX / 2) + (i * (this->width() - offsetX) / m_xTick);
        m_linesX << QPoint(x, this->height() - (offsetY / 2) + 5);
        m_linesX << QPoint(x, offsetY / 2);
    }
    for (i = 1; i <= m_yTick; i++) {
        y = (offsetY / 2) + (i * (this->height() - offsetY) / m_yTick);
        m_linesY << QPoint(this->width() - (offsetX / 2), y);
        m_linesY << QPoint((offsetX / 2) - 5, y);
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void WidgetChart::paintEvent(QPaintEvent *event) {
    QPointF point;
    int i;

    this->updateScale();

    QFrame::paintEvent(event);
    QPainter painter(this);
    QPainterPath painterPath;
    QBrush brush(m_gradient);

    painter.setRenderHint(QPainter::Antialiasing);

    // Draw background color
    painter.fillRect(0, 0, this->width(), this->height(), Qt::white);

    // Draw axes
    painter.setPen(m_penGrey);
    painter.drawRect(m_rectGraph);
    painter.drawLines(m_linesX);
    painter.drawLines(m_linesY);
    painter.setPen(m_penText);
    for (i = 0; i < m_xTick; i++) {
        point = m_linesX.at(i * 2);
        painter.drawText(QPointF(point.x() - 10, point.y() + 15), QString::number
            ((m_xMax / m_xTick) * (i + 1)));
    }
    for (i = 0; i < m_yTick; i++) {
        point = m_linesY.at(i * 2 + 1);
        painter.drawText(QPointF(point.x() - 40, point.y() - 15), QString::number
            ((m_yMax / m_yTick) * (m_yTick - i)));
    }

    // Draw curve
    painter.setPen(m_pen);
    painterPath.moveTo(m_line.at(0));
    for (int i = 1, l = m_line.size(); i < l; i++) {
        painterPath.lineTo(m_line.at(i));
    }
    painterPath.lineTo(m_horizontalLine.p2());
    painterPath.lineTo(m_horizontalLine.p1());
    painter.fillPath(painterPath, brush);
    painter.drawPath(painterPath);
}

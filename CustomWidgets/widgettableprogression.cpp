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

#include <QHeaderView>
#include <QtMath>
#include "widgettableprogression.h"

const QString WidgetTableProgression::NAME_LEVEL = "Level";
const QColor WidgetTableProgression::EDITED_COLOR = Qt::green;
const QColor WidgetTableProgression::SUB_EDITED_COLOR = Qt::cyan;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTableProgression::WidgetTableProgression(QWidget *parent) :
    QTableWidget (parent),
    m_completing(false),
    m_table(nullptr),
    m_totalWidget(nullptr),
    m_editedColor(EDITED_COLOR)
{
    connect(this, SIGNAL(cellChanged(int, int)), this, SLOT(on_cellChanged(int,
        int)));
    setEditable(true);
}

WidgetTableProgression::~WidgetTableProgression() {

}

void WidgetTableProgression::setEditable(bool b) {
    if (b) {
        this->setEditTriggers(QAbstractItemView::AllEditTriggers);
    } else {
        this->setEditTriggers(QAbstractItemView::NoEditTriggers);
    }
}

QHash<int, int> * WidgetTableProgression::table() {
    return m_table;
}

void WidgetTableProgression::setTable(QHash<int, int> *table) {
    m_table = table;
}

WidgetTableProgression * WidgetTableProgression::totalWidget() const {
    return m_totalWidget;
}

void WidgetTableProgression::setTotalWidget(WidgetTableProgression *w) {
    m_totalWidget = w;
}

void WidgetTableProgression::setEditedColor(const QColor &color) {
    m_editedColor = color;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void WidgetTableProgression::initialize(int rows, QString progression) {
    m_completing = true;
    clear();
    setRowCount(rows);
    setColumnCount(2);
    setHorizontalHeaderItem(0, new QTableWidgetItem(NAME_LEVEL));
    setHorizontalHeaderItem(1, new QTableWidgetItem(progression));
    verticalHeader()->hide();
}

// -------------------------------------------------------

void WidgetTableProgression::updateWithBaseInflation(int base, double inflation,
    int maxLevel, QHash<int, int> *subTable)
{
    int t = 0, exp;
    double pow = 2.4 + inflation / 100.0;
    QTableWidgetItem *item;

    if (m_totalWidget != nullptr) {
        m_totalWidget->setItem(0, 0, new QTableWidgetItem(QString::number(1)));
        m_totalWidget->setItem(0, 1, new QTableWidgetItem(QString::number(0)));
    }
    for (int i = 2; i <= maxLevel; i++) {
        exp = qFloor(base * (qPow(i + 3, pow) / qPow(5, pow)));
        if (m_totalWidget != nullptr) {
            t += exp;
            m_totalWidget->setItem(i - 1, 0, new QTableWidgetItem(QString::number(i)));
            m_totalWidget->setItem(i - 1, 1, new QTableWidgetItem(QString::number(t)));
        }
        setItem(i - 2, 0, new QTableWidgetItem(QString::number(i - 1)));
        setItem(i - 2, 1, new QTableWidgetItem(QString::number(exp)));
    }
    if (maxLevel >= rowCount()) {
        exp = qFloor(base * (qPow(maxLevel + 4, pow) / qPow(5, pow)));
        setItem(maxLevel - 1, 0, new QTableWidgetItem(QString::number(maxLevel)));
        setItem(maxLevel - 1, 1, new QTableWidgetItem(QString::number(exp)));
    }

    // Complete with exp table
    if (m_totalWidget != nullptr) {
        QHash<int, int>::const_iterator i;
        if (subTable != nullptr) {
            for (i = subTable->begin(); i != subTable->end(); i++) {
                item = new QTableWidgetItem(QString::number(i.value()));
                setItem(i.key() - 1, 0, new QTableWidgetItem(QString::number(i.key())));
                setItem(i.key() - 1, 1, item);
                item->setForeground(SUB_EDITED_COLOR);
            }
        }
        for (i = m_table->begin(); i != m_table->end(); i++) {
            item = new QTableWidgetItem(QString::number(i.value()));
            setItem(i.key() - 1, 0, new QTableWidgetItem(QString::number(i.key())));
            setItem(i.key() - 1, 1, item);
            item->setForeground(m_editedColor);
        }
        if (!m_table->isEmpty() || (subTable != nullptr && !subTable->isEmpty()))
        {
            updateTotal();
        }
    }
    m_completing = false;
}

// -------------------------------------------------------

void WidgetTableProgression::updateWithEasing(SystemProgressionTable*
    progression, QChartView *chartView, int finalLevel)
{
    int start = progression->initialValue()->kind() == PrimitiveValueKind
        ::Number ? progression->initialValue()->numberValue() : 0;
    int change = (progression->finalValue()->kind() == PrimitiveValueKind
        ::Number ? progression->finalValue()->numberValue() : 0) - start;
    int duration = finalLevel - 1;
    int value = 0;
    double x;
    bool specificValue;
    QTableWidgetItem *itemLevel, * itemProgression;

    // Chart lines initialization
    QLineSeries *line = new QLineSeries();
    QLineSeries *horizontalLine = new QLineSeries();
    QVector<QPointF> expList;
    *line<< QPointF(0, 0);

    // Update according to equation
    for (int i = 0; i < finalLevel; i++) {
        x = i;
        value = m_table->value(i + 1, -1);
        specificValue = value != -1;
        if (!specificValue) {
            switch (progression->equation()) {
            case 0:
                value = easingLinear(x, start, change, duration); break;
            case -1:
                value = easingQuadraticIn(x, start, change, duration); break;
            case 1:
                value = easingQuadraticOut(x, start, change, duration); break;
            case -2:
                value = easingCubicIn(x, start, change, duration); break;
            case 2:
                value = easingCubicOut(x, start, change, duration); break;
            case -3:
                value = easingQuarticIn(x, start, change, duration); break;
            case 3:
                value = easingQuarticOut(x, start, change, duration); break;
            case -4:
                value = easingQuinticIn(x, start, change, duration); break;
            case 4:
                value = easingQuinticOut(x, start, change, duration); break;
            default:
                value = 0;
            }
        }

        itemLevel = new QTableWidgetItem(QString::number(i + 1));
        itemProgression = new QTableWidgetItem(QString::number(value));
        if (specificValue) {
            itemProgression->setForeground(m_editedColor);
        }

        setItem(i, 0, itemLevel);
        setItem(i, 1, itemProgression);
        *line << QPoint(i + 1, value);
    }

    // Chart config
    *horizontalLine << QPointF(1, 0) << QPointF(finalLevel, 0);
    QAreaSeries *series = new QAreaSeries(line, horizontalLine);
    QPen pen(0x4f0a5b);
    pen.setWidth(2);
    series->setPen(pen);
    QLinearGradient gradient(QPointF(0, 0), QPointF(0, 1));
    gradient.setColorAt(0.0, 0x9234a3);
    gradient.setColorAt(1.0, 0x9234a3);
    gradient.setCoordinateMode(QGradient::ObjectBoundingMode);
    series->setBrush(gradient);
    QChart *chart = chartView->chart();
    chart->removeAllSeries();
    chart->addSeries(series);
    chart->createDefaultAxes();
    QValueAxis *axisX = reinterpret_cast<QValueAxis *>(chart->axes(Qt
        ::Horizontal).first());
    QValueAxis *axisY = reinterpret_cast<QValueAxis *>(chart->axes(Qt
        ::Vertical).first());
    axisX->setRange(1, finalLevel);
    axisY->setRange(0, value);
    axisX->setTickCount(5);
    axisX->setLabelFormat("%d");
    axisY->setTickCount(5);
    axisY->setLabelFormat("%d");
    chart->legend()->setVisible(false);
    chartView->setRenderHint(QPainter::Antialiasing);

    m_completing = false;
}

// -------------------------------------------------------

int WidgetTableProgression::easingLinear(double x, int start, int change,
    int duration)
{
    return qFloor(change * x / duration + start);
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuadraticIn(double x, int start, int change,
    int duration)
{
    x /= duration;
    return qFloor(change * x * x + start);
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuadraticOut(double x, int start, int change,
    int duration)
{
    x /= duration;
    return qFloor(-change * x * (x - 2) + start);
}

// -------------------------------------------------------

int WidgetTableProgression::easingCubicIn(double x, int start, int change,
    int duration)
{
    x /= duration;
    return qFloor(change * x * x * x + start);
}

// -------------------------------------------------------

int WidgetTableProgression::easingCubicOut(double x, int start, int change,
    int duration)
{
    x /= duration;
    x--;
    return qFloor(change * (x * x * x + 1) + start);
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuarticIn(double x, int start, int change,
    int duration)
{
    x /= duration;
    return qFloor(change * x * x * x * x + start);
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuarticOut(double x, int start, int change,
    int duration)
{
    x /= duration;
    x--;
    return qFloor(-change * (x * x * x * x - 1) + start);
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuinticIn(double x, int start, int change,
    int duration)
{
    x /= duration;
    return qFloor(change * x * x * x * x * x + start);
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuinticOut(double x, int start, int change,
    int duration)
{
    x /= duration;
    x--;
    return qFloor(change * (x * x * x * x * x + 1) + start);
}

// -------------------------------------------------------

void WidgetTableProgression::updateTotal() {
    if (m_totalWidget != nullptr) {
        int total = 0;
        m_totalWidget->item(0, 1)->setText(QString::number(0));
        for (int i = 1; i < m_totalWidget->rowCount(); i++) {
            total += item(i - 1, 1)->text().toInt();
            m_totalWidget->item(i, 1)->setText(QString::number(total));
        }
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetTableProgression::on_cellChanged(int row, int column) {
    if (!m_completing && m_table != nullptr) {
        if (column == 0) {
            item(row, column)->setText(QString::number(row + 1));
        } else {
            QString value = item(row, column)->text();
            int correctedValue = value.toInt();
            QTableWidgetItem *itemProgression = item(row, 1);
            itemProgression->setText(QString::number(correctedValue));
            itemProgression->setForeground(m_editedColor);
            m_table->insert(row + 1, correctedValue);
            updateTotal();
        }
    }
}

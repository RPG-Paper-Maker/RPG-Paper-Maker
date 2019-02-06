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

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTableProgression::WidgetTableProgression(QWidget *parent) :
    QTableWidget (parent),
    m_completing(false),
    m_table(nullptr),
    m_totalWidget(nullptr)
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
                setItem(i.key() - 1, 0, new QTableWidgetItem(QString::number(i.key())));
                setItem(i.key() - 1, 1, new QTableWidgetItem(QString::number(i.value())));
            }
        }
        for (i = m_table->begin(); i != m_table->end(); i++) {
            setItem(i.key() - 1, 0, new QTableWidgetItem(QString::number(i.key())));
            setItem(i.key() - 1, 1, new QTableWidgetItem(QString::number(i.value())));
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
    progression, QChartView *chart, int finalLevel)
{
    int start = progression->initialValue();
    int change = progression->finalValue() - progression->initialValue();
    int value = 0, x;

    // Update according to equation
    for (int i = 0; i < finalLevel; i++) {
        x = i + 1;
        switch (progression->equation()) {
        case 0:
            value = easingLinear(x, start, change, finalLevel); break;
        case 1:
            value = easingQuadraticIn(x, start, change, finalLevel); break;
        case -1:
            value = easingQuadraticOut(x, start, change, finalLevel); break;
        case 2:
            value = easingCubicIn(x, start, change, finalLevel); break;
        case -2:
            value = easingCubicOut(x, start, change, finalLevel); break;
        case 3:
            value = easingQuarticIn(x, start, change, finalLevel); break;
        case -3:
            value = easingQuarticOut(x, start, change, finalLevel); break;
        case 4:
            value = easingQuinticIn(x, start, change, finalLevel); break;
        case -4:
            value = easingQuinticOut(x, start, change, finalLevel); break;
        default:
            value = 0;
        }
        setItem(0, 0, new QTableWidgetItem(QString::number(x)));
        setItem(0, 1, new QTableWidgetItem(QString::number(value)));
    }

    // Complete with table
    QHash<int, int>::const_iterator i;
    for (i = m_table->begin(); i != m_table->end(); i++) {
        setItem(i.key() - 1, 0, new QTableWidgetItem(QString::number(i.key())));
        setItem(i.key() - 1, 1, new QTableWidgetItem(QString::number(i.value())));
    }

    m_completing = false;
}

// -------------------------------------------------------

int WidgetTableProgression::easingLinear(int x, int start, int change,
    int duration)
{
    return change * x / duration + start;
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuadraticIn(int x, int start, int change,
    int duration)
{
    x /= duration;
    return change * x * x + start;
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuadraticOut(int x, int start, int change,
    int duration)
{
    x /= duration;
    return -change * x * (x - 2) + start;
}

// -------------------------------------------------------

int WidgetTableProgression::easingCubicIn(int x, int start, int change,
    int duration)
{
    x /= duration;
    return change * x * x * x + start;
}

// -------------------------------------------------------

int WidgetTableProgression::easingCubicOut(int x, int start, int change,
    int duration)
{
    x /= duration;
    x--;
    return change * (x * x * x + 1) + start;
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuarticIn(int x, int start, int change,
    int duration)
{
    x /= duration;
    return change * x * x * x * x + start;
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuarticOut(int x, int start, int change,
    int duration)
{
    x /= duration;
    x--;
    return -change * (x * x * x * x - 1) + start;
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuinticIn(int x, int start, int change,
    int duration)
{
    x /= duration;
    return change * x * x * x * x * x + start;
}

// -------------------------------------------------------

int WidgetTableProgression::easingQuinticOut(int x, int start, int change,
    int duration)
{
    x /= duration;
    x--;
    return change * (x * x * x * x * x + 1) + start;
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
            item(row, column)->setText(QString::number(correctedValue));
            m_table->insert(row + 1, correctedValue);
            updateTotal();
        }
    }
}

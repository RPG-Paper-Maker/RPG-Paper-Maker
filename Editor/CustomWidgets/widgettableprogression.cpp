/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QHeaderView>
#include <QtMath>
#include "widgettableprogression.h"
#include "rpm.h"

const QColor WidgetTableProgression::EDITED_COLOR = Qt::green;
const QColor WidgetTableProgression::SUB_EDITED_COLOR = Qt::cyan;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTableProgression::WidgetTableProgression(QWidget *parent) :
    QTableWidget(parent),
    m_completing(false),
    m_table(nullptr),
    m_totalWidget(nullptr),
    m_editedColor(EDITED_COLOR)
{
    connect(this, SIGNAL(cellChanged(int, int)), this, SLOT(on_cellChanged(
        int, int)));
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
    setRowCount(rows);
    setColumnCount(2);
    setHorizontalHeaderItem(0, new QTableWidgetItem(RPM::translate(Translations
        ::LEVEL)));
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

    // Complete with exp table
    if (m_totalWidget != nullptr) {
        QHash<int, int>::const_iterator i;
        if (subTable != nullptr) {
            for (i = subTable->begin(); i != subTable->end(); i++) {
                this->item(i.key() - 1, 0)->setText(QString::number(i.value()));
                item = this->item(i.key() - 1, 1);
                item->setText(QString::number(i.value()));
                item->setForeground(SUB_EDITED_COLOR);
            }
        }
        for (i = m_table->begin(); i != m_table->end(); i++) {
            this->item(i.key() - 1, 0)->setText(QString::number(i.value()));
            item = this->item(i.key() - 1, 1);
            item->setText(QString::number(i.value()));
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
    progression, WidgetChart *chartView, int finalLevel)
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
    QLine horizontalLine;
    QVector<QPoint> line;
    QVector<QPoint> expList;
    line << QPoint(0, 0);

    // Update according to equation
    for (int i = 0; i < finalLevel; i++) {
        x = i;
        value = m_table->value(i + 1, -1);
        specificValue = value != -1;
        if (!specificValue) {
            value = SystemProgressionTable::easing(progression->equation(), x,
                start, change, duration);
        }

        itemLevel = new QTableWidgetItem(QString::number(i + 1));
        itemProgression = new QTableWidgetItem(QString::number(value));
        if (specificValue) {
            itemProgression->setForeground(m_editedColor);
        }

        setItem(i, 0, itemLevel);
        setItem(i, 1, itemProgression);
        line << QPoint(i + 1, value);
    }

    // Chart config
    horizontalLine.setP1(QPoint(1, 0));
    horizontalLine.setP2(QPoint(finalLevel, 0));
    QPen pen(0x4f0a5b);
    pen.setWidth(2);
    QLinearGradient gradient(QPointF(0, 0), QPointF(0, 1));
    gradient.setColorAt(0.0, 0x9234a3);
    gradient.setColorAt(1.0, 0x9234a3);
    gradient.setCoordinateMode(QGradient::ObjectBoundingMode);

    chartView->initialize(line, horizontalLine, pen, gradient, 1, finalLevel, 5,
        0, value, 5);

    m_completing = false;
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

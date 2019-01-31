/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include <QtCharts>
#include <QtMath>
#include "paneldatasclass.h"
#include "ui_paneldatasclass.h"
#include "systemstatisticprogression.h"
#include "systemclassskill.h"

using namespace QtCharts;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelDatasClass::PanelDatasClass(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelDatasClass)
{
    ui->setupUi(this);
}

PanelDatasClass::~PanelDatasClass()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelDatasClass::initialize() {
    ui->treeViewStatisticsProgression->initializeNewItemInstance(new
        SystemStatisticProgression);
    ui->treeViewClassSkills->initializeNewItemInstance(new SystemClassSkill);
}

// -------------------------------------------------------

void PanelDatasClass::update(SystemClass *sysClass, SystemClass *originalClass)
{
    m_class = sysClass;
    m_originalClass = originalClass;
    int initialLevel = getInheritValue(sysClass->initialLevel(), originalClass
        ->initialLevel());
    int maxLevel = getInheritValue(sysClass->maxLevel(), originalClass
        ->maxLevel());
    int expBase = getInheritValue(sysClass->expBase(), originalClass->expBase());
    int expInflation = getInheritValue(sysClass->expInflation(), originalClass
        ->expInflation());

    ui->spinBoxClassInitialLevel->setValue(initialLevel);
    ui->spinBoxClassMaxLevel->setValue(maxLevel);
    ui->spinBoxClassBase->setValue(expBase);
    ui->spinBoxClassInflation->setValue(expInflation);
    ui->treeViewStatisticsProgression->initializeModel(sysClass
        ->statisticsProgression());
    ui->treeViewStatisticsProgression->setColumnWidth(0,200);
    ui->treeViewStatisticsProgression->setColumnWidth(1,50);
    ui->treeViewStatisticsProgression->setColumnWidth(2,50);
    ui->treeViewClassSkills->initializeModel(sysClass->skills());
    ui->treeViewClassSkills->setColumnWidth(0,250);

    if (m_class == m_originalClass) {
        ui->pushButtonSetClassValues->setVisible(false);
    }

    updateExperience();
}

// -------------------------------------------------------

int PanelDatasClass::getInheritValue(int v1, int v2) {
    return v1 == -1 ? v2 : v1;
}

// -------------------------------------------------------

void PanelDatasClass::updateExperience() {
    int initialLevel = ui->spinBoxClassInitialLevel->value();
    int maxLevel = ui->spinBoxClassMaxLevel->value();
    int expBase = ui->spinBoxClassBase->value();
    int expInflation = ui->spinBoxClassInflation->value();

    ui->tableWidgetNextLevel->clear();
    ui->tableWidgetNextLevel->setRowCount(maxLevel);
    ui->tableWidgetNextLevel->setColumnCount(2);
    ui->tableWidgetNextLevel->setHorizontalHeaderItem(0, new QTableWidgetItem(
        "Level"));
    ui->tableWidgetNextLevel->setHorizontalHeaderItem(1, new QTableWidgetItem(
        "Experience"));
    ui->tableWidgetNextLevel->verticalHeader()->hide();
    ui->tableWidgetTotalLevel->clear();
    ui->tableWidgetTotalLevel->setRowCount(maxLevel + 1);
    ui->tableWidgetTotalLevel->setColumnCount(2);
    ui->tableWidgetTotalLevel->setHorizontalHeaderItem(0, new QTableWidgetItem(
        "Level"));
    ui->tableWidgetTotalLevel->setHorizontalHeaderItem(1, new QTableWidgetItem(
        "Experience"));
    ui->tableWidgetTotalLevel->verticalHeader()->hide();

    int exp, total = 0;
    qreal pow = static_cast<qreal>(2.4f + expInflation / 100.0f);
    ui->tableWidgetTotalLevel->setItem(0, 0, new QTableWidgetItem(QString
        ::number(0)));
    ui->tableWidgetTotalLevel->setItem(0, 1, new QTableWidgetItem(QString
        ::number(0)));
    for (int i = 1; i <= maxLevel; i++) {
        exp = qFloor(expBase * (qPow(i + 3, pow) / qPow(5, pow)));
        total += exp;
        ui->tableWidgetNextLevel->setItem(i - 1, 0, new QTableWidgetItem(QString
            ::number(i - 1)));
        ui->tableWidgetNextLevel->setItem(i - 1, 1, new QTableWidgetItem(QString
            ::number(exp)));
        ui->tableWidgetTotalLevel->setItem(i, 0, new QTableWidgetItem(QString
            ::number(i)));
        ui->tableWidgetTotalLevel->setItem(i, 1, new QTableWidgetItem(QString
            ::number(total)));
    }

    /*
    QLineSeries *expLine = new QLineSeries();
    QLineSeries *horizontalLine = new QLineSeries();
    QVector<QPointF> expList;
    expList << QPointF(0, 0);
    *expLine << QPointF(0, 0);
    qreal pow = static_cast<qreal>(2.4f + expInflation / 100.0f);
    int previousExp = 0, count = 1;

    QPointF expPoint;
    const int MAX_X_POINT = 100;
    int freq = qFloor((maxLevel - initialLevel + 1) / static_cast<qreal>(MAX_X_POINT));
    for (int i = 1; i < maxLevel; i++) {
        expPoint = QPointF(i, previousExp + qFloor(expBase * (qPow(i + 3, pow) / qPow(
            5, pow))));
        previousExp = static_cast<int>(expPoint.y());
        expList << expPoint;
        if (count == freq) {
            count = 1;
            *expLine << QPoint(initialLevel + i - 1, previousExp);
        }
    }
    *horizontalLine << QPointF(ui->spinBoxClassInitialLevel->value(), 0) << QPointF(ui->spinBoxClassMaxLevel->value(), 0);
    QAreaSeries *series = new QAreaSeries(expLine, horizontalLine);
    QPen pen(0x4f0a5b);
    pen.setWidth(2);
    series->setPen(pen);
    QLinearGradient gradient(QPointF(0, 0), QPointF(0, 1));
    gradient.setColorAt(0.0, 0x9234a3);
    gradient.setColorAt(1.0, 0x9234a3);
    gradient.setCoordinateMode(QGradient::ObjectBoundingMode);
    series->setBrush(gradient);
    QChart *chart = ui->graphicsView->chart();
    chart->removeAllSeries();
    chart->addSeries(series);
    chart->createDefaultAxes();
    QValueAxis *axisX = reinterpret_cast<QValueAxis *>(chart->axes(Qt::Horizontal).first());
    QValueAxis *axisY = reinterpret_cast<QValueAxis *>(chart->axes(Qt::Vertical).first());
    axisX->setRange(initialLevel, maxLevel);
    axisY->setRange(0, previousExp);
    axisX->setTickCount(5);
    axisX->setLabelFormat("%d");
    axisY->setTickCount(5);
    axisY->setLabelFormat("%d");
    chart->legend()->setVisible(false);
    ui->graphicsView->setRenderHint(QPainter::Antialiasing);*/
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassInitialLevel_valueChanged(int i) {
    m_class->setInitialLevel(i, m_originalClass);
    updateExperience();
}

// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassMaxLevel_valueChanged(int i) {
    m_class->setMaxLevel(i, m_originalClass);
    updateExperience();
}

// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassBase_valueChanged(int i) {
    m_class->setExpBase(i, m_originalClass);
    updateExperience();
}

// -------------------------------------------------------

void PanelDatasClass::on_spinBoxClassInflation_valueChanged(int i) {
    m_class->setExpInflation(i, m_originalClass);
    updateExperience();
}

// -------------------------------------------------------

void PanelDatasClass::on_pushButtonSetClassValues_clicked() {
    ui->spinBoxClassInitialLevel->setValue(m_originalClass->initialLevel());
    ui->spinBoxClassMaxLevel->setValue(m_originalClass->maxLevel());
    ui->spinBoxClassBase->setValue(m_originalClass->expBase());
    ui->spinBoxClassInflation->setValue(m_originalClass->expInflation());
}

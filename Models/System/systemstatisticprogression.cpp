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

#include "systemstatisticprogression.h"
#include "dialogsystemstatisticprogression.h"

const QString SystemStatisticProgression::JSON_MAX = "m";
const QString SystemStatisticProgression::JSON_ISFIX = "if";
const QString SystemStatisticProgression::JSON_TABLE = "t";
const QString SystemStatisticProgression::JSON_RANDOM = "r";
const QString SystemStatisticProgression::JSON_FORMULA = "f";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemStatisticProgression::SystemStatisticProgression() :
    SystemStatisticProgression(1, "", 1, true, new SystemProgressionTable, 0, "")
{

}

SystemStatisticProgression::SystemStatisticProgression(int i, QString n, int max
    , bool isFix, SystemProgressionTable *table, int random, QString formula) :
    SuperListItem(i, n),
    m_max(max),
    m_isFix(isFix),
    m_table(table),
    m_random(random),
    m_formula(formula)
{

}

SystemStatisticProgression::~SystemStatisticProgression() {
    delete m_table;
}

int SystemStatisticProgression::max() const {
    return m_max;
}

void SystemStatisticProgression::setMax(int m) {
    m_max = m;
}

bool SystemStatisticProgression::isFix() const {
    return m_isFix;
}

void SystemStatisticProgression::setIsFix(bool f) {
    m_isFix = f;
}

SystemProgressionTable * SystemStatisticProgression::table() const {
    return m_table;
}

int SystemStatisticProgression::random() const {
    return m_random;
}

void SystemStatisticProgression::setRandom(int r) {
    m_random = r;
}

QString SystemStatisticProgression::formula() const {
    return m_formula;
}

void SystemStatisticProgression::setFormula(QString f) {
    m_formula = f;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemStatisticProgression::openDialog() {
    SystemStatisticProgression statisticProgression;
    statisticProgression.setCopy(*this);
    DialogSystemStatisticProgression dialog(statisticProgression);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(statisticProgression);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemStatisticProgression::createCopy() const {
    SystemStatisticProgression* super = new SystemStatisticProgression;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemStatisticProgression::setCopy(const SystemStatisticProgression&
                                         statisticProgression)
{
    SuperListItem::setCopy(statisticProgression);
    p_id = statisticProgression.p_id;

    m_max = statisticProgression.m_max;
    m_isFix = statisticProgression.m_isFix;
    m_table = statisticProgression.m_table;
    m_random = statisticProgression.m_random;
    m_formula = statisticProgression.m_formula;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemStatisticProgression::getModelRow() const {
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* itemStatistic = new QStandardItem;
    QStandardItem* itemInitial = new QStandardItem;
    QStandardItem* itemFinal = new QStandardItem;
    itemStatistic->setData(QVariant::fromValue(
                               reinterpret_cast<quintptr>(this)));
    itemStatistic->setText(toString());
    itemInitial->setData(QVariant::fromValue(m_table->initialValue()));
    itemInitial->setText(m_isFix ? QString::number(m_table->initialValue()) : "-");
    itemFinal->setData(QVariant::fromValue(m_table->finalValue()));
    itemFinal->setText(m_isFix ? QString::number(m_table->finalValue()) : "-");
    row.append(itemStatistic);
    row.append(itemInitial);
    row.append(itemFinal);

    return row;
}

// -------------------------------------------------------

void SystemStatisticProgression::read(const QJsonObject &json) {
    SuperListItem::read(json);
    QJsonObject obj;

    m_max = json[JSON_MAX].toInt();
    m_isFix = json[JSON_ISFIX].toBool();
    obj = json[JSON_TABLE].toObject();
    m_table->read(obj);
    m_random = json[JSON_RANDOM].toInt();
    m_formula = json[JSON_FORMULA].toString();
}

// -------------------------------------------------------

void SystemStatisticProgression::write(QJsonObject &json) const {
    SuperListItem::write(json);
    QJsonObject obj;

    json[JSON_MAX] = m_max;
    json[JSON_ISFIX] = m_isFix;
    obj = json[JSON_TABLE].toObject();
    m_table->write(obj);
    json[JSON_RANDOM] = m_random;
    json[JSON_FORMULA] = m_formula;
}

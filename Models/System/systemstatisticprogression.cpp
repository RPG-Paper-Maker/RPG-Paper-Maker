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

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemStatisticProgression::SystemStatisticProgression() :
    SystemStatisticProgression(1, "", 1, 1, nullptr)
{

}

SystemStatisticProgression::SystemStatisticProgression(int i, QString n,
                                                       int init, int final,
                                                       QVector<int>* curve) :
    SuperListItem(i,n),
    m_initialValue(init),
    m_finalValue(final),
    m_curve(curve)
{

}

SystemStatisticProgression::~SystemStatisticProgression(){
    if (m_curve != nullptr) delete m_curve;
}

int SystemStatisticProgression::initialValue() const { return m_initialValue; }

void SystemStatisticProgression::setInitialValue(int i) { m_initialValue = i; }

int SystemStatisticProgression::finalValue() const { return m_finalValue; }

void SystemStatisticProgression::setFinalValue(int i) { m_finalValue = i; }

QVector<int>* SystemStatisticProgression::curve() const { return m_curve; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemStatisticProgression::openDialog(){
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

SuperListItem* SystemStatisticProgression::createCopy() const{
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

    m_initialValue = statisticProgression.initialValue();
    m_finalValue = statisticProgression.finalValue();

    if (m_curve != nullptr){
        for (int i = 0; i < statisticProgression.m_curve->size(); i++)
            m_curve->append(statisticProgression.m_curve->at(i));
    }
}

// -------------------------------------------------------

QList<QStandardItem *> SystemStatisticProgression::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* itemStatistic = new QStandardItem;
    QStandardItem* itemInitial = new QStandardItem;
    QStandardItem* itemFinal = new QStandardItem;
    itemStatistic->setData(QVariant::fromValue(
                               reinterpret_cast<quintptr>(this)));
    itemStatistic->setText(toString());
    itemInitial->setData(QVariant::fromValue(initialValue()));
    itemInitial->setText(QString::number(initialValue()));
    itemFinal->setData(QVariant::fromValue(finalValue()));
    itemFinal->setText(QString::number(finalValue()));
    row.append(itemStatistic);
    row.append(itemInitial);
    row.append(itemFinal);

    return row;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemStatisticProgression::read(const QJsonObject &json){
    SuperListItem::read(json);
    m_initialValue = json["i"].toInt();
    m_finalValue = json["f"].toInt();

    if (json.contains("c")){
        QJsonArray tab = json["c"].toArray();
        for (int i = 0; i < tab.size(); i++)
            m_curve->append(tab[i].toInt());
    }
}

void SystemStatisticProgression::write(QJsonObject &json) const{
    SuperListItem::write(json);
    json["i"] = initialValue();
    json["f"] = finalValue();

    if (m_curve != nullptr){
        QJsonArray tab;
        for (int i = 0; i < m_curve->size(); i++)
            tab.append(m_curve->at(i));
        json["c"] = tab;
    }
}

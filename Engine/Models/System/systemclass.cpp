/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#include "systemclass.h"
#include "main.h"
#include "systemstatisticprogression.h"
#include "systemclassskill.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemClass::SystemClass() : SuperListItem()
{
    m_statisticsProgression = new QStandardItemModel();
    m_skills = new QStandardItemModel();
}

SystemClass::SystemClass(int i, QString n, int initialLevel, int maxLevel,
                         int expBase, int expInflation,
                         QStandardItemModel *stat, QStandardItemModel *s) :
    SuperListItem(i,n),
    m_initialLevel(initialLevel),
    m_maxLevel(maxLevel),
    m_expBase(expBase),
    m_expInflation(expInflation),
    m_statisticsProgression(stat),
    m_skills(s)
{

}

SystemClass::~SystemClass(){
    SuperListItem::deleteModel(m_statisticsProgression);
    SuperListItem::deleteModel(m_skills);
}

int SystemClass::initialLevel() const { return m_initialLevel; }

int SystemClass::maxLevel() const { return m_maxLevel; }

int SystemClass::expBase() const { return m_expBase; }

int SystemClass::expInflation() const { return m_expInflation; }

QStandardItemModel* SystemClass::statisticsProgression() const {
    return m_statisticsProgression;
}

QStandardItemModel* SystemClass::skills() const {
    return m_skills;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemClass::read(const QJsonObject &json){
    SuperListItem::read(json);
    QJsonArray tab;
    QStandardItem* item;
    QList<QStandardItem *> row;
    SystemStatisticProgression* statisticProgression;
    SystemClassSkill* classSkill;

    // Experience
    m_initialLevel = json["iniL"].toInt();
    m_maxLevel = json["mxL"].toInt();
    m_expBase = json["eB"].toInt();
    m_expInflation = json["eI"].toInt();


    // Statistics
    m_statisticsProgression->setHorizontalHeaderLabels(
                QStringList({"Statistic","Initial","Final"}));
    tab = json["stats"].toArray();
    for (int i = 0; i < tab.size(); i++){
        statisticProgression = new SystemStatisticProgression;
        statisticProgression->read(tab[i].toObject());
        row = statisticProgression->getModelRow();
        m_statisticsProgression->appendRow(row);
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_statisticsProgression->appendRow(item);

    // Skills
    m_skills->setHorizontalHeaderLabels(QStringList({"Skills","Levels"}));
    tab = json["skills"].toArray();
    for (int i = 0; i < tab.size(); i++){
        classSkill = new SystemClassSkill;
        classSkill->read(tab[i].toObject());
        row = classSkill->getModelRow();
        m_skills->appendRow(row);
    }
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_skills->appendRow(item);
}

void SystemClass::write(QJsonObject &json) const{
    SuperListItem::write(json);
    QJsonArray tab;
    QJsonObject obj;
    int l;

    // Experience
    json["iniL"] = m_initialLevel;
    json["mxL"] = m_maxLevel;
    json["eB"] = m_expBase;
    json["eI"] = m_expInflation;

    // Statistics
    tab = QJsonArray();
    l = m_statisticsProgression->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        obj = QJsonObject();
        SystemStatisticProgression* statisticsProgression =
                (SystemStatisticProgression*) m_statisticsProgression->item(i)
                ->data().value<quintptr>();
        statisticsProgression->write(obj);
        tab.append(obj);
    }
    json["stats"] = tab;

    // Skills
    tab = QJsonArray();
    l = m_skills->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        obj = QJsonObject();
        SystemClassSkill* classSkill = (SystemClassSkill*) m_skills->item(i)
                ->data().value<quintptr>();
        classSkill->write(obj);
        tab.append(obj);
    }
    json["skills"] = tab;
}

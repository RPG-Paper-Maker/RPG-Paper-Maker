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

#include "skillsdatas.h"
#include "systemskill.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SkillsDatas::SkillsDatas()
{
    m_model = new QStandardItemModel;
}

SkillsDatas::~SkillsDatas()
{
    SuperListItem::deleteModel(m_model);
}

void SkillsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::pathSkills), *this);
}

QStandardItemModel* SkillsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SkillsDatas::setDefault(){
    int i = 1;
    SystemSkill* skills[] = {new SystemSkill(i++, "Attack"),
                             new SystemSkill(i++, "Skill"),
                             new SystemSkill(i++, "Item"),
                             new SystemSkill(i++, "Escape"),
                             new SystemSkill(i++, "Fire"),
                             new SystemSkill(i++, "Water"),
                             new SystemSkill(i++, "Wind"),
                             new SystemSkill(i++, "Shadow"),
                             new SystemSkill(i++, "Blazing sword"),
                             new SystemSkill(i++, "Bandage"),
                             new SystemSkill(i++, "Concentration")};

    int length = (sizeof(skills)/sizeof(*skills));
    QStandardItem* item;

    for (i = 0; i < length; i++){
        item = new QStandardItem;
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(skills[i])));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(skills[i]->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SkillsDatas::read(const QJsonObject &json){

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    QJsonArray jsonList = json["skills"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        QStandardItem* item = new QStandardItem;
        SystemSkill* sysSkill = new SystemSkill;
        sysSkill->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(
                          reinterpret_cast<quintptr>(sysSkill)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(sysSkill->toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void SkillsDatas::write(QJsonObject &json) const{
    QJsonArray jsonArray;
    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        QJsonObject jsonCommon;
        SystemSkill* sysSkill = ((SystemSkill*)m_model->item(i)->data()
                                 .value<quintptr>());
        sysSkill->write(jsonCommon);
        jsonArray.append(jsonCommon);
    }
    json["skills"] = jsonArray;
}

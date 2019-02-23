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
    int i, length;
    QStandardItem* item;
    SystemSkill *skill;

    QString names[] = {
        "Attack", "Skill", "Item", "Escape", "Heal", "Fire", "Water", "Wind",
        "Shadow", "Blazing sword", "Bandage", "Concentration"
    };
    int iconsID[] = {
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    };
    QString descriptions[] = {
        "A basic attack.",
        "Use a skill.",
        "Use an item.",
        "Escape from the battle.",
        "Heal one ally.",
        "A fire attack on one enemy.",
        "A water attack on one enemy.",
        "A wind attack on one enemy.",
        "A darkness attack on one ennemy.",
        "An amazing fire sword attack on all the ennemies.",
        "Heal yourself with bandages.",
        "Increase your strength for the next attacks."
    };
    TargetKind targetsKind[] = {
        TargetKind::Enemy, TargetKind::None, TargetKind::None, TargetKind::None,
        TargetKind::Ally, TargetKind::Enemy, TargetKind::Enemy,
        TargetKind::Enemy, TargetKind::Enemy, TargetKind::AllEnemies,
        TargetKind::User, TargetKind::User
    };
    AvailableKind availablesKind[] = {
        AvailableKind::Battle, AvailableKind::Battle, AvailableKind::Battle,
        AvailableKind::Battle, AvailableKind::Always, AvailableKind::Battle,
        AvailableKind::Battle, AvailableKind::Battle, AvailableKind::Battle,
        AvailableKind::Battle, AvailableKind::Always, AvailableKind::Battle
    };
    int songsID[] = {
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1
    };
    length = (sizeof(names)/sizeof(*names));

    for (i = 0; i < length; i++) {
        skill = new SystemSkill(i + 1, new LangsTranslation(names[i]), iconsID
            [i], new LangsTranslation(descriptions[i]), targetsKind[i], new
            PrimitiveValue(QString("t.hp > 0")), availablesKind[i],
            new SystemPlaySong(songsID[i], SongKind::Sound), new PrimitiveValue(
            PrimitiveValueKind::None), new PrimitiveValue(PrimitiveValueKind
            ::None), new QStandardItemModel, new QStandardItemModel);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(skill)));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(skill->toString());
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

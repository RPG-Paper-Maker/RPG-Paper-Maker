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

#include "systemclassskill.h"
#include "dialogsystemclassskill.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemClassSkill::SystemClassSkill() :
    SystemClassSkill(1, "", 1)
{

}

SystemClassSkill::SystemClassSkill(int i, QString n, int l) :
    SuperListItem(i,n),
    m_level(l)
{

}

SystemClassSkill::~SystemClassSkill(){

}

int SystemClassSkill::level() const { return m_level; }

void SystemClassSkill::setLevel(int i) { m_level = i; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemClassSkill::openDialog(){
    SystemClassSkill skill;
    skill.setCopy(*this);
    DialogSystemClassSkill dialog(skill);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(skill);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemClassSkill::createCopy() const{
    SystemClassSkill* super = new SystemClassSkill;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemClassSkill::setCopy(const SystemClassSkill& skill){
    SuperListItem::setCopy(skill);
    p_id = skill.p_id;

    m_level = skill.level();
}

// -------------------------------------------------------

QList<QStandardItem *> SystemClassSkill::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* itemSkill = new QStandardItem;
    QStandardItem* itemLevel = new QStandardItem;
    itemSkill->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemSkill->setText(toString());
    itemLevel->setData(QVariant::fromValue(level()));
    itemLevel->setText(QString::number(level()));
    row.append(itemSkill);
    row.append(itemLevel);

    return row;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemClassSkill::read(const QJsonObject &json){
    SuperListItem::read(json);
    m_level = json["l"].toInt();
}

void SystemClassSkill::write(QJsonObject &json) const{
    SuperListItem::write(json);
    json["l"] = m_level;
}

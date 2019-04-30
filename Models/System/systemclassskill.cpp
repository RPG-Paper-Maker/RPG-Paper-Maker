/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    SuperListItem(i, n, true),
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
    itemSkill->setFlags(itemSkill->flags() ^ (Qt::ItemIsDropEnabled));
    itemLevel->setData(QVariant::fromValue(level()));
    itemLevel->setText(QString::number(level()));
    itemLevel->setFlags(itemLevel->flags() ^ (Qt::ItemIsDropEnabled));
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

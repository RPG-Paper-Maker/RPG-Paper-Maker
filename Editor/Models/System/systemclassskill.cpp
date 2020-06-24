/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

void SystemClassSkill::setCopy(const SuperListItem &super) {
    const SystemClassSkill *classSkill;

    SuperListItem::setCopy(super);
    classSkill = reinterpret_cast<const SystemClassSkill *>(&super);

    p_id = classSkill->p_id;
    m_level = classSkill->level();
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

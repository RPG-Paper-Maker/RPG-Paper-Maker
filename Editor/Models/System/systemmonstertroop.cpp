/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemmonstertroop.h"
#include "rpm.h"
#include "dialogsystemmonstertroop.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemMonsterTroop::SystemMonsterTroop() :
    SystemMonsterTroop(1, "", 1)
{

}

SystemMonsterTroop::SystemMonsterTroop(int i, QString n, int level) :
    SuperListItem(i,n),
    m_level(level)
{

}

SystemMonsterTroop::~SystemMonsterTroop() {

}

int SystemMonsterTroop::level() const {
    return m_level;
}

void SystemMonsterTroop::setLevel(int l) {
    m_level = l;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemMonsterTroop::updateName() {
    p_name = SuperListItem::getById(RPM::get()->project()->gameDatas()
        ->monstersDatas()->model()->invisibleRootItem(), p_id)->name();
}

// -------------------------------------------------------


bool SystemMonsterTroop::openDialog(){
    SystemMonsterTroop monsterTroop;
    monsterTroop.setCopy(*this);
    DialogSystemMonsterTroop dialog(monsterTroop);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(monsterTroop);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemMonsterTroop::createCopy() const {
    SystemMonsterTroop* super = new SystemMonsterTroop;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemMonsterTroop::setCopy(const SystemMonsterTroop& monsterTroop){
    p_id = monsterTroop.p_id;
    updateName();
    m_level = monsterTroop.m_level;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemMonsterTroop::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* itemID = new QStandardItem;
    QStandardItem* itemLevel = new QStandardItem;
    itemID->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemID->setText(toString());
    itemID->setFlags(itemID->flags() ^ (Qt::ItemIsDropEnabled));
    itemLevel->setText(QString::number(m_level));
    itemLevel->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemLevel->setFlags(itemLevel->flags() ^ (Qt::ItemIsDropEnabled));
    row.append(itemID);
    row.append(itemLevel);

    return row;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemMonsterTroop::read(const QJsonObject &json){
    p_id = json["id"].toInt();
    updateName();
    m_level = json["l"].toInt();
}

// -------------------------------------------------------

void SystemMonsterTroop::write(QJsonObject &json) const{
    json["id"] = id();
    json["l"] = level();
}

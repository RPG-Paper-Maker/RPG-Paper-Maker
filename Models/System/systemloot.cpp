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

#include "systemloot.h"
#include "dialogsystemloot.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemLoot::SystemLoot() :
    SystemLoot(1, "", LootKind::Item, new PrimitiveValue, new PrimitiveValue)
{

}

SystemLoot::SystemLoot(int i, QString n, LootKind kind,
                       PrimitiveValue *nb, PrimitiveValue *probability) :
    SuperListItem(i,n),
    m_kind(kind),
    m_number(nb),
    m_probability(probability)
{

}

SystemLoot::~SystemLoot(){
    delete m_number;
    delete m_probability;
}

LootKind SystemLoot::kind() const { return m_kind; }

void SystemLoot::setKind(LootKind k) { m_kind = k; }

PrimitiveValue* SystemLoot::number() const { return m_number; }

PrimitiveValue *SystemLoot::probability() const { return m_probability; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemLoot::openDialog(){
    SystemLoot loot;
    loot.setCopy(*this);
    DialogSystemLoot dialog(loot);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(loot);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemLoot::createCopy() const{
    SystemLoot* super = new SystemLoot;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemLoot::setCopy(const SystemLoot& loot){
    SuperListItem::setCopy(loot);
    m_kind = loot.kind();
    m_number->setCopy(loot.number());
    m_probability->setCopy(loot.probability());
}

// -------------------------------------------------------

QList<QStandardItem *> SystemLoot::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* itemLoot = new QStandardItem;
    QStandardItem* itemNumber = new QStandardItem;
    QStandardItem* itemProba = new QStandardItem;
    itemLoot->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemLoot->setText(toString());
    itemNumber->setText(m_number->toString());
    itemProba->setText(m_probability->toString());
    row.append(itemLoot);
    row.append(itemNumber);
    row.append(itemProba);

    return row;
}

// -------------------------------------------------------

void SystemLoot::updateName(){
    QStandardItemModel* model = nullptr;
    switch (kind()){
    case LootKind::Item:
        model = Wanok::get()->project()->gameDatas()->itemsDatas()->model();
        break;
    case LootKind::Weapon:
        model = Wanok::get()->project()->gameDatas()->weaponsDatas()->model();
        break;
    case LootKind::Armor:
        model = Wanok::get()->project()->gameDatas()->armorsDatas()->model();
        break;
    }

    SuperListItem* super = SuperListItem::getById(model->invisibleRootItem(),
                                                  id());
    setName(super->name());
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemLoot::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_kind = static_cast<LootKind>(json["k"].toInt());
    m_number->read(json["n"].toObject());
    m_probability->read(json["p"].toObject());
}

void SystemLoot::write(QJsonObject &json) const{
    SuperListItem::write(json);
    QJsonObject obj;

    json["k"] = (int) m_kind;
    obj = QJsonObject();
    m_number->write(obj);
    json["n"] = obj;
    obj = QJsonObject();
    m_probability->write(obj);
    json["p"] = obj;
}

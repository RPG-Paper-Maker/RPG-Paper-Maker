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

#include "systemloot.h"
#include "dialogsystemloot.h"
#include "rpm.h"

const QString SystemLoot::JSON_KIND = "k";
const QString SystemLoot::JSON_NUMBER = "n";
const QString SystemLoot::JSON_PROBABILITY = "p";
const QString SystemLoot::JSON_INITIAL = "i";
const QString SystemLoot::JSON_FINAL = "f";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemLoot::SystemLoot() :
    SystemLoot(1, "", LootKind::Item, new PrimitiveValue, new PrimitiveValue,
    new PrimitiveValue(1), new PrimitiveValue(1))
{

}

SystemLoot::SystemLoot(int i, QString n, LootKind kind, PrimitiveValue *number,
    PrimitiveValue *probability, PrimitiveValue *initialLevel, PrimitiveValue
    *finalLevel) :
    SuperListItem(i,n),
    m_kind(kind),
    m_number(number),
    m_probability(probability),
    m_initialLevel(initialLevel),
    m_finalLevel(finalLevel)
{

}

SystemLoot::~SystemLoot() {
    delete m_number;
    delete m_probability;
    delete m_initialLevel;
    delete m_finalLevel;
}

LootKind SystemLoot::kind() const {
    return m_kind;
}

void SystemLoot::setKind(LootKind k) {
    m_kind = k;
}

PrimitiveValue * SystemLoot::number() const {
    return m_number;
}

PrimitiveValue * SystemLoot::probability() const {
    return m_probability;
}

PrimitiveValue * SystemLoot::initialLevel() const {
    return m_initialLevel;
}

PrimitiveValue * SystemLoot::finalLevel() const {
    return m_finalLevel;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemLoot::updateName() {
    QStandardItemModel *model = nullptr;
    switch (kind()) {
    case LootKind::Item:
        model = RPM::get()->project()->gameDatas()->itemsDatas()->model();
        break;
    case LootKind::Weapon:
        model = RPM::get()->project()->gameDatas()->weaponsDatas()->model();
        break;
    case LootKind::Armor:
        model = RPM::get()->project()->gameDatas()->armorsDatas()->model();
        break;
    }

    setName(SuperListItem::getById(model->invisibleRootItem(), id())->name());
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemLoot::openDialog() {
    SystemLoot loot;
    loot.setCopy(*this);
    DialogSystemLoot dialog(loot);
    if (dialog.exec() == QDialog::Accepted) {
        setCopy(loot);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemLoot::createCopy() const {
    SystemLoot *super = new SystemLoot;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemLoot::setCopy(const SystemLoot &loot) {
    SuperListItem::setCopy(loot);

    p_id = loot.p_id;
    m_kind = loot.kind();
    m_number->setCopy(*loot.m_number);
    m_probability->setCopy(*loot.m_probability);
    m_initialLevel->setCopy(*loot.m_initialLevel);
    m_finalLevel->setCopy(*loot.m_finalLevel);
}

// -------------------------------------------------------

QList<QStandardItem *> SystemLoot::getModelRow() const {
    QList<QStandardItem *> row = QList<QStandardItem *>();
    QStandardItem *itemLoot = new QStandardItem;
    QStandardItem *itemNumber = new QStandardItem;
    QStandardItem *itemProba = new QStandardItem;
    QStandardItem *itemInit = new QStandardItem;
    QStandardItem *itemFinal = new QStandardItem;
    itemLoot->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemLoot->setText(toString());
    itemNumber->setText(m_number->toString());
    itemProba->setText(m_probability->toString());
    itemInit->setText(m_initialLevel->toString());
    itemFinal->setText(m_finalLevel->toString());
    row.append(itemLoot);
    row.append(itemNumber);
    row.append(itemProba);
    row.append(itemInit);
    row.append(itemFinal);

    return row;
}

// -------------------------------------------------------

void SystemLoot::read(const QJsonObject &json) {
    SuperListItem::read(json);

    m_kind = static_cast<LootKind>(json[JSON_KIND].toInt());
    m_number->read(json[JSON_NUMBER].toObject());
    m_probability->read(json[JSON_PROBABILITY].toObject());
    m_initialLevel->read(json[JSON_INITIAL].toObject());
    m_finalLevel->read(json[JSON_FINAL].toObject());
}

// -------------------------------------------------------

void SystemLoot::write(QJsonObject &json) const {
    SuperListItem::write(json);
    QJsonObject obj;

    json[JSON_KIND] = static_cast<int>(m_kind);
    obj = QJsonObject();
    m_number->write(obj);
    json[JSON_NUMBER] = obj;
    obj = QJsonObject();
    m_probability->write(obj);
    json[JSON_PROBABILITY] = obj;
    obj = QJsonObject();
    m_initialLevel->write(obj);
    json[JSON_INITIAL] = obj;
    obj = QJsonObject();
    m_finalLevel->write(obj);
    json[JSON_FINAL] = obj;
}

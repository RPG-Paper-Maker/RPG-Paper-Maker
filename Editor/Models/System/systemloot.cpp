/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemloot.h"
#include "dialogsystemloot.h"
#include "rpm.h"

const QString SystemLoot::JSON_KIND = "k";
const QString SystemLoot::JSON_LOOT_ID = "lid";
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
    SystemLoot(1, "", LootKind::Item, new PrimitiveValue(PrimitiveValueKind
        ::DataBase, 1), new PrimitiveValue(1), new PrimitiveValue(100), new
        PrimitiveValue(1), new PrimitiveValue(1))
{

}

SystemLoot::SystemLoot(int i, QString n, LootKind kind, PrimitiveValue *lootID,
    PrimitiveValue *number, PrimitiveValue *probability, PrimitiveValue
    *initialLevel, PrimitiveValue *finalLevel) :
    SuperListItem(i,n),
    m_kind(kind),
    m_lootID(lootID),
    m_number(number),
    m_probability(probability),
    m_initialLevel(initialLevel),
    m_finalLevel(finalLevel)
{
    updateName();
}

SystemLoot::~SystemLoot() {
    delete m_lootID;
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

PrimitiveValue * SystemLoot::lootID() const {
    return m_lootID;
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

    if (m_lootID->kind() != PrimitiveValueKind::Variable) {
        setId(m_lootID->numberValue());
        setName(SuperListItem::getById(model->invisibleRootItem(),
            id())->name());
    }
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

void SystemLoot::setCopy(const SuperListItem &super) {
    const SystemLoot *loot;

    SuperListItem::setCopy(super);
    loot = reinterpret_cast<const SystemLoot *>(&super);

    m_kind = loot->kind();
    m_lootID->setCopy(*loot->m_lootID);
    m_number->setCopy(*loot->m_number);
    m_probability->setCopy(*loot->m_probability);
    m_initialLevel->setCopy(*loot->m_initialLevel);
    m_finalLevel->setCopy(*loot->m_finalLevel);

    updateName();
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
    itemLoot->setFlags(itemLoot->flags() ^ (Qt::ItemIsDropEnabled));
    itemNumber->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemNumber->setText(m_number->toString());
    itemNumber->setFlags(itemNumber->flags() ^ (Qt::ItemIsDropEnabled));
    itemProba->setText(m_probability->toString());
    itemProba->setFlags(itemProba->flags() ^ (Qt::ItemIsDropEnabled));
    itemProba->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemInit->setText(m_initialLevel->toString());
    itemInit->setFlags(itemLoot->flags() ^ (Qt::ItemIsDropEnabled));
    itemInit->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemFinal->setText(m_finalLevel->toString());
    itemFinal->setFlags(itemFinal->flags() ^ (Qt::ItemIsDropEnabled));
    itemFinal->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    row.append(itemLoot);
    row.append(itemNumber);
    row.append(itemProba);
    row.append(itemInit);
    row.append(itemFinal);

    return row;
}

// -------------------------------------------------------

QString SystemLoot::toString() const {
    return m_lootID->kind() == PrimitiveValueKind::Variable ? m_lootID
        ->toString() : SuperListItem::toString();
}

// -------------------------------------------------------

void SystemLoot::read(const QJsonObject &json) {
    m_kind = static_cast<LootKind>(json[JSON_KIND].toInt());
    m_lootID->read(json[JSON_LOOT_ID].toObject());
    m_number->read(json[JSON_NUMBER].toObject());
    m_probability->read(json[JSON_PROBABILITY].toObject());
    m_initialLevel->read(json[JSON_INITIAL].toObject());
    m_finalLevel->read(json[JSON_FINAL].toObject());

    updateName();
}

// -------------------------------------------------------

void SystemLoot::write(QJsonObject &json) const {
    QJsonObject obj;

    json[JSON_KIND] = static_cast<int>(m_kind);
    obj = QJsonObject();
    m_number->write(obj);
    json[JSON_NUMBER] = obj;
    obj = QJsonObject();
    m_lootID->write(obj);
    json[JSON_LOOT_ID] = obj;
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

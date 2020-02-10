/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogsystemprimitive.h"

const QString SystemPrimitive::JSON_PRIM = "p";
const QString SystemPrimitive::JSON_KIND = "K";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPrimitive::SystemPrimitive() :
    SystemPrimitive(-1, "", new PrimitiveValue(0), SystemPrimitiveKind
        ::ElementEfficiency)
{

}

SystemPrimitive::SystemPrimitive(int i, QString n, PrimitiveValue *p,
    SystemPrimitiveKind k) :
    SuperListItem(i, n),
    m_prim(p),
    m_kind(k)
{

}

SystemPrimitive::~SystemPrimitive() {
    delete m_prim;
}

PrimitiveValue * SystemPrimitive::prim() const {
    return m_prim;
}

void SystemPrimitive::setKind(SystemPrimitiveKind k) {
    m_kind = k;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemPrimitive::openDialog() {
    SystemPrimitive prim;
    prim.setCopy(*this);
    DialogSystemPrimitive dialog(prim);

    switch (m_kind) {
    case SystemPrimitiveKind::ElementEfficiency:
        dialog.initializeNumberVariableDouble("Enter a number efficiency...");
        break;
    }

    if (dialog.exec() == QDialog::Accepted) {
        this->setCopy(prim);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem * SystemPrimitive::createCopy() const {
    SystemPrimitive *super = new SystemPrimitive;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemPrimitive::setCopy(const SuperListItem &super) {
    const SystemPrimitive *prim;

    SuperListItem::setCopy(super);

    prim = reinterpret_cast<const SystemPrimitive *>(&super);
    m_prim->setCopy(*prim->m_prim);
    m_kind = prim->m_kind;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemPrimitive::getModelRow() const{
    QList<QStandardItem *> row;
    QStandardItem *itemName = new QStandardItem;
    QStandardItem* itemPrim = new QStandardItem;

    itemName->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemName->setText(toString());
    itemName->setFlags(itemName->flags() ^ (Qt::ItemIsDropEnabled));
    switch (m_kind) {
    case SystemPrimitiveKind::ElementEfficiency:
        itemPrim->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
        itemPrim->setText("x " + QString::number(this->prim()->numberDoubleValue()));
        itemPrim->setFlags(itemPrim->flags() ^ (Qt::ItemIsDropEnabled));
        break;
    }
    row.append(itemName);
    row.append(itemPrim);

    return row;
}

// -------------------------------------------------------

void SystemPrimitive::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_PRIM)) {
        m_prim->read(json[JSON_PRIM].toObject());
    }
    if (json.contains(JSON_KIND)) {
        m_kind = static_cast<SystemPrimitiveKind>(json[JSON_KIND].toInt());
    }
}

// -------------------------------------------------------

void SystemPrimitive::write(QJsonObject &json) const {
    QJsonObject obj;

    SuperListItem::write(json);

    if (!m_prim->isDefaultNumberValue()) {
        obj = QJsonObject();
        m_prim->write(obj);
        json[JSON_PRIM] = obj;
    }
    if (m_kind != SystemPrimitiveKind::ElementEfficiency) {
        json[JSON_KIND] = static_cast<int>(m_kind);
    }
}

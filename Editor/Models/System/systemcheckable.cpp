/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcheckable.h"

const QString SystemCheckable::JSON_CHECKED = "checked";
const bool SystemCheckable::DEFAULT_CHECKED = true;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCheckable::SystemCheckable(int id, QString name, bool checked) :
    SuperListItem(id, name),
    m_checked(checked)
{

}

SystemCheckable::~SystemCheckable()
{

}

bool SystemCheckable::checked() const
{
    return m_checked;
}

void SystemCheckable::setChecked(bool checked)
{
    m_checked = checked;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemCheckable::createCopy() const
{
    SystemCheckable* super = new SystemCheckable;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCheckable::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);
    const SystemCheckable *checkable = reinterpret_cast<const SystemCheckable *>(&super);
    m_checked = checkable->m_checked;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemCheckable::getModelRow() const
{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(this->toString());
    item->setCheckable(true);
    if (m_checked)
    {
        item->setCheckState(Qt::Checked);
    }
    row.append(item);
    return row;
}

// -------------------------------------------------------

void SystemCheckable::read(const QJsonObject &json)
{
    SuperListItem::read(json);
    if (json.contains(JSON_CHECKED))
    {
        m_checked = json[JSON_CHECKED].toBool();
    }
}

// -------------------------------------------------------

void SystemCheckable::write(QJsonObject &json) const
{
    SuperListItem::write(json);
    if (m_checked != DEFAULT_CHECKED)
    {
        json[JSON_CHECKED] = m_checked;
    }
}

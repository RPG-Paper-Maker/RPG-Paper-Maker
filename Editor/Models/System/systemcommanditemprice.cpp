/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcommanditemprice.h"
#include "systemcost.h"
#include "dialogsystemcommanditemprice.h"
#include "rpm.h"
#include "systemcommonskillitem.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCommandItemPrice::SystemCommandItemPrice() :
    SystemCommandItemPrice(-1, "")
{

}

SystemCommandItemPrice::SystemCommandItemPrice(int i, QString n, int
    selectionItem, PrimitiveValue *itemID, PrimitiveValue *weaponID, PrimitiveValue
    *armorID, int selectionPrice, QStandardItemModel *specificPrice, int
    selectionStock, PrimitiveValue *specificStock) :
    SuperListItem(i, n),
    m_selectionItem(selectionItem),
    m_itemID(itemID),
    m_weaponID(weaponID),
    m_armorID(armorID),
    m_selectionPrice(selectionPrice),
    m_specificPrice(specificPrice),
    m_selectionStock(selectionStock),
    m_specificStock(specificStock)
{
    m_itemID->setModelDataBase(RPM::get()->project()->gameDatas()->itemsDatas()->model());
    m_weaponID->setModelDataBase(RPM::get()->project()->gameDatas()->weaponsDatas()->model());
    m_armorID->setModelDataBase(RPM::get()->project()->gameDatas()->armorsDatas()->model());
    this->initializeHeaders();
}

int SystemCommandItemPrice::selectionItem() const
{
    return m_selectionItem;
}

void SystemCommandItemPrice::setSelectionItem(int selectionItem)
{
    m_selectionItem = selectionItem;
}

PrimitiveValue * SystemCommandItemPrice::itemID() const
{
    return m_itemID;
}

PrimitiveValue * SystemCommandItemPrice::weaponID() const
{
    return m_weaponID;
}

PrimitiveValue * SystemCommandItemPrice::armorID() const
{
    return m_armorID;
}

int SystemCommandItemPrice::selectionPrice() const
{
    return m_selectionPrice;
}

void SystemCommandItemPrice::setSelectionPrice(int selectionPrice)
{
    m_selectionPrice = selectionPrice;
}

QStandardItemModel * SystemCommandItemPrice::specificPrice() const
{
    return m_specificPrice;
}

int SystemCommandItemPrice::selectionStock() const
{
    return m_selectionStock;
}

void SystemCommandItemPrice::setSelectionStock(int selectionStock)
{
    m_selectionStock = selectionStock;
}

PrimitiveValue * SystemCommandItemPrice::specificStock() const
{
    return m_specificStock;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemCommandItemPrice::toStringItem() const
{
    switch (m_selectionItem)
    {
    case 0:
        return m_itemID->toString();
    case 1:
        return m_weaponID->toString();
    case 2:
        return m_armorID->toString();
    }
    return "";
}

// -------------------------------------------------------

QString SystemCommandItemPrice::toStringPrice() const
{
    if (m_selectionPrice == 0)
    {
        SystemCommonSkillItem *item = nullptr;
        switch (m_selectionItem) {
        case 0:
            if (m_itemID->isFixNumberValue())
            {
                item = reinterpret_cast<SystemCommonSkillItem *>(SuperListItem
                    ::getById(RPM::get()->project()->gameDatas()->itemsDatas()
                    ->model()->invisibleRootItem(), m_itemID->numberValue()));
            } else
            {
                return RPM::translate(Translations::DEFAULT);
            }
            break;
        case 1:
            if (m_weaponID->isFixNumberValue())
            {
                item = reinterpret_cast<SystemCommonSkillItem *>(SuperListItem
                    ::getById(RPM::get()->project()->gameDatas()->weaponsDatas()
                    ->model()->invisibleRootItem(), m_weaponID->numberValue()));
            } else
            {
                return RPM::translate(Translations::DEFAULT);
            }
            break;
        case 2:
            if (m_armorID->isFixNumberValue())
            {
                item = reinterpret_cast<SystemCommonSkillItem *>(SuperListItem
                    ::getById(RPM::get()->project()->gameDatas()->armorsDatas()
                    ->model()->invisibleRootItem(), m_armorID->numberValue()));
            } else
            {
                return RPM::translate(Translations::DEFAULT);
            }
            break;
        }
        return SystemCost::toStringPrice(item->modelPrice());
    }
    return SystemCost::toStringPrice(m_specificPrice);
}

// -------------------------------------------------------

QString SystemCommandItemPrice::toStringStock() const
{
    return m_selectionStock == 0 ? "∞" : m_specificStock->toString();
}

// -------------------------------------------------------

void SystemCommandItemPrice::initialize(const EventCommand *command, int& i)
{
    m_selectionItem = command->valueCommandAt(i++).toInt();
    switch (m_selectionItem)
    {
    case 0:
        m_itemID->initializeCommandParameter(command, i);
        break;
    case 1:
        m_weaponID->initializeCommandParameter(command, i);
        break;
    case 2:
        m_armorID->initializeCommandParameter(command, i);
        break;
    }
    m_selectionPrice = command->valueCommandAt(i++).toInt();
    if (m_selectionPrice == 1)
    {
        SystemCost *cost;
        while (command->valueCommandAt(i) != "-") {
            cost = new SystemCost;
            cost->initialize(command, i);
            m_specificPrice->appendRow(cost->getModelRow());
        }
        i++;
    }
    m_selectionStock = command->valueCommandAt(i++).toInt();
    if (m_selectionStock == 1)
    {
        m_specificStock->initializeCommandParameter(command, i);
    }
}

// -------------------------------------------------------

void SystemCommandItemPrice::getCommand(QVector<QString> &command)
{
    command.append(QString::number(m_selectionItem));
    switch (m_selectionItem)
    {
    case 0:
        m_itemID->getCommandParameter(command);
        break;
    case 1:
        m_weaponID->getCommandParameter(command);
        break;
    case 2:
        m_armorID->getCommandParameter(command);
        break;
    }
    command.append(QString::number(m_selectionPrice));
    if (m_selectionPrice == 1)
    {
        SystemCost *cost;
        for (int i = 0, l = m_specificPrice->invisibleRootItem()->rowCount(); i < l; i++)
        {
            cost = reinterpret_cast<SystemCost *>(SuperListItem::getItemModelAt(
                m_specificPrice, i));
            if (cost != nullptr)
            {
                cost->getCommand(command);
            }
        }
        command.append("-");
    }
    command.append(QString::number(m_selectionStock));
    if (m_selectionStock == 1)
    {
        m_specificStock->getCommandParameter(command);
    }
}

// -------------------------------------------------------

void SystemCommandItemPrice::initializeHeaders()
{
    m_specificPrice->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::PRICE)}));
}

// -------------------------------------------------------
//
//  VIRTUAL METHODS
//
// -------------------------------------------------------

QString SystemCommandItemPrice::toString() const
{
    return this->toStringItem() + RPM::SPACE + RPM::SLASH + RPM::SPACE + this
        ->toStringPrice() + RPM::SPACE + RPM::SLASH + RPM::SPACE + this
        ->toStringStock();
}

// -------------------------------------------------------

bool SystemCommandItemPrice::openDialog()
{
    SystemCommandItemPrice itemPrice;
    itemPrice.setCopy(*this);
    DialogSystemCommandItemPrice dialog(itemPrice);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(itemPrice);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem * SystemCommandItemPrice::createCopy() const
{
    SystemCommandItemPrice *super = new SystemCommandItemPrice;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCommandItemPrice::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);
    const SystemCommandItemPrice *itemPrice = reinterpret_cast<const
        SystemCommandItemPrice *>(&super);
    m_selectionItem = itemPrice->m_selectionItem;
    m_itemID->setCopy(*itemPrice->m_itemID);
    m_weaponID->setCopy(*itemPrice->m_weaponID);
    m_armorID->setCopy(*itemPrice->m_armorID);
    m_selectionPrice = itemPrice->m_selectionPrice;
    SuperListItem::deleteModel(m_specificPrice, false);
    SuperListItem::copy(m_specificPrice, itemPrice->m_specificPrice);
    m_selectionStock = itemPrice->m_selectionStock;
    m_specificStock->setCopy(*itemPrice->m_specificStock);
    this->initializeHeaders();

}

// -------------------------------------------------------

QList<QStandardItem*> SystemCommandItemPrice::getModelRow() const
{
    QList<QStandardItem *> row = QList<QStandardItem*>();
    QStandardItem *itemName = new QStandardItem;
    itemName->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemName->setFlags(itemName->flags() ^ (Qt::ItemIsDropEnabled));
    itemName->setText(this->toStringItem());
    row.append(itemName);
    QStandardItem *itemPrice = new QStandardItem;
    itemPrice->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemPrice->setFlags(itemPrice->flags() ^ (Qt::ItemIsDropEnabled));
    itemPrice->setText(this->toStringPrice());
    row.append(itemPrice);
    QStandardItem *itemStock = new QStandardItem;
    itemStock->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemStock->setFlags(itemStock->flags() ^ (Qt::ItemIsDropEnabled));
    itemStock->setText(this->toStringStock());
    row.append(itemStock);
    return row;
}

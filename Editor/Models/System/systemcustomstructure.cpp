/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcustomstructure.h"
#include "dialogsystemcustomstructure.h"
#include "systemcustomstructureelement.h"
#include "rpm.h"

const QString SystemCustomStructure::JSON_IS_LIST = "il";
const QString SystemCustomStructure::JSON_PROPERTIES = "p";
const QString SystemCustomStructure::JSON_LIST = "l";
const bool SystemCustomStructure::DEFAULT_IS_LIST = false;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCustomStructure::SystemCustomStructure() :
    SystemCustomStructure(0, "")
{

}

SystemCustomStructure::SystemCustomStructure(int i, QString n, bool isList,
    QStandardItemModel *m) :
    SuperListItem(i, n),
    m_properties(isList ? nullptr : m),
    m_list(isList ? m : nullptr)
{

}

SystemCustomStructure::~SystemCustomStructure()
{
    if (m_properties != nullptr)
    {
        SuperListItem::deleteModel(m_properties);
    }
    if (m_list != nullptr)
    {
        SuperListItem::deleteModel(m_list);
    }
}

QStandardItemModel * SystemCustomStructure::model() const
{
    return this->isList() ? m_list : m_properties;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemCustomStructure::isList() const
{
    return m_list != nullptr;
}

void SystemCustomStructure::initializeHeaders()
{
    if (m_properties != nullptr)
    {
        m_properties->setHorizontalHeaderLabels(QStringList({"Key", RPM::translate(
            Translations::VALUE)}));
    }
    if (m_list != nullptr)
    {
        m_list->setHorizontalHeaderLabels(QStringList({"Index", RPM::translate(
            Translations::VALUE)}));
    }
}

// -------------------------------------------------------

void SystemCustomStructure::clearProperties()
{
    if (m_properties != nullptr)
    {
        SuperListItem::deleteModel(m_properties, false);
    }
}

// -------------------------------------------------------

void SystemCustomStructure::clearList()
{
    if (m_list != nullptr)
    {
        SuperListItem::deleteModel(m_list, false);
    }
}

// -------------------------------------------------------

void SystemCustomStructure::removeElement(SystemCustomStructureElement *element)
{
    for (int i = 0, l = this->model()->invisibleRootItem()->rowCount(); i < l;
        i++)
    {
        if (SuperListItem::getItemModelAt(this->model(), i) == element)
        {
            this->model()->removeRow(i);
            delete element;
            break;
        }
    }
}

// -------------------------------------------------------

void SystemCustomStructure::insertElementAfter(SystemCustomStructureElement
    *elementBefore, SystemCustomStructureElement *element)
{
    if (elementBefore == nullptr)
    {
        this->model()->appendRow(element->getModelRow());
        return;
    }
    for (int i = 0, l = this->model()->invisibleRootItem()->rowCount(); i < l;
        i++)
    {
        if (SuperListItem::getItemModelAt(this->model(), i) == elementBefore)
        {
            this->model()->insertRow(i, element->getModelRow());
            break;
        }
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemCustomStructure::toString() const
{
    QString str;
    SystemCustomStructureElement *element;
    if (m_properties == nullptr)
    {
        str += RPM::BRACKET_LEFT;
        QStringList list;
        for (int i = 0, l = m_list->invisibleRootItem()->rowCount(); i < l; i++)
        {
            element = reinterpret_cast<SystemCustomStructureElement *>(
                SuperListItem::getItemModelAt(m_list, i));
            if (element != nullptr)
            {
                list << element->toStringName();
            }
        }
        str += list.join(RPM::COMMA);
        str += RPM::BRACKET_RIGHT;
    } else
    {
        str += RPM::BRACE_LEFT;
        QStringList list;
        for (int i = 0, l = m_properties->invisibleRootItem()->rowCount(); i
             < l; i++)
        {
            element = reinterpret_cast<SystemCustomStructureElement *>(
                SuperListItem::getItemModelAt(m_properties, i));
            if (element != nullptr)
            {
                list << element->toStringName();
            }
        }
        str += list.join(RPM::COMMA);
        str += RPM::BRACE_RIGHT;
    }
    return str;
}

// -------------------------------------------------------

bool SystemCustomStructure::openDialog()
{
    SystemCustomStructure custom;
    custom.setCopy(*this);
    DialogSystemCustomStructure dialog(custom);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(custom);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemCustomStructure::createCopy() const
{
    SystemCustomStructure *super = new SystemCustomStructure;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCustomStructure::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);

    const SystemCustomStructure *custom = reinterpret_cast<const
        SystemCustomStructure *>(&super);
    this->clearProperties();
    if (custom->m_properties == nullptr)
    {
        m_properties = nullptr;
    } else
    {
        if (m_properties == nullptr)
        {
            m_properties = new QStandardItemModel;
        }
        SuperListItem::copy(m_properties, custom->m_properties);
    }
    this->clearList();
    if (custom->m_list == nullptr)
    {
        m_list = nullptr;
    } else
    {
        if (m_list == nullptr)
        {
            m_list = new QStandardItemModel;
        }
        SuperListItem::copy(m_list, custom->m_list);
    }
    this->initializeHeaders();
}

// -------------------------------------------------------

void SystemCustomStructure::read(const QJsonObject &json)
{
    SuperListItem::read(json);

    // Clear model
    this->clearProperties();
    this->clearList();

    bool isList = DEFAULT_IS_LIST;
    if (json.contains(JSON_IS_LIST))
    {
        isList = json[JSON_IS_LIST].toBool();
    }
    if (isList)
    {
        m_list = new QStandardItemModel;
        SuperListItem::readList(m_list, new SystemCustomStructureElement, json,
            JSON_LIST);
    } else
    {
        m_properties = new QStandardItemModel;
        SuperListItem::readList(m_properties, new SystemCustomStructureElement,
            json, JSON_PROPERTIES);
    }
    this->initializeHeaders();
}

// -------------------------------------------------------

void SystemCustomStructure::write(QJsonObject &json) const {
    SuperListItem::write(json);

    if (m_properties != nullptr)
    {
        SuperListItem::writeTree(m_properties, json, JSON_PROPERTIES);
    }
    if (m_list != nullptr)
    {
        json[JSON_IS_LIST] = true;
        SuperListItem::writeTree(m_list, json, JSON_LIST);
    }
}

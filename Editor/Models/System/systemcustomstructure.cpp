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

SystemCustomStructure::SystemCustomStructure(int i, QString n, PrimitiveValue *v
    , bool il, QStandardItemModel *p, QStandardItemModel *l) :
    SuperListItem(i, n),
    m_value(v),
    m_isList(il),
    m_properties(p),
    m_list(l)
{

}

SystemCustomStructure::~SystemCustomStructure()
{
    if (m_value != nullptr)
    {
        delete m_value;
    }
    if (m_properties != nullptr)
    {
        SuperListItem::deleteModel(m_properties);
    }
    if (m_list != nullptr)
    {
        SuperListItem::deleteModel(m_list);
    }
}

PrimitiveValue * SystemCustomStructure::value()
{
    return m_value;
}

bool SystemCustomStructure::isList() const
{
    return m_isList;
}

QStandardItemModel * SystemCustomStructure::properties() const
{
    return m_properties;
}

QStandardItemModel * SystemCustomStructure::list() const
{
    return m_list;
}

void SystemCustomStructure::setIsList(bool isList)
{
    m_isList = isList;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

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
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemCustomStructure::toString() const
{
    QString str;
    if (m_isList)
    {
        str += RPM::BRACKET_LEFT;
        QStringList list;
        for (int i = 0, l = m_list->invisibleRootItem()->rowCount(); i < l; i++)
        {
            list << reinterpret_cast<SystemCustomStructure *>(m_list->item(i)
                ->data().value<quintptr>())->toString();
        }
        str += list.join(RPM::COMMA);
        str += RPM::BRACKET_RIGHT;
    } else
    {
        if (m_value == nullptr)
        {
            str += RPM::BRACE_LEFT;
            QStringList list;
            for (int i = 0, l = m_properties->invisibleRootItem()->rowCount(); i
                 < l; i++)
            {
                list << reinterpret_cast<SystemCustomStructure *>(m_properties
                    ->item(i)->data().value<quintptr>())->toString();
            }
            str += list.join(RPM::COMMA);
            str += RPM::BRACE_RIGHT;
        } else
        {
            str += '"' + p_name + '"' + RPM::COLON + m_value->toString();
        }
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
    if (custom->m_properties == nullptr)
    {
        m_properties = nullptr;
    } else
    {
        this->clearProperties();
        SuperListItem::copy(m_properties, custom->m_properties);
    }
    if (custom->m_list == nullptr)
    {
        m_list = nullptr;
    } else
    {
        this->clearList();
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

    if (json.contains(JSON_IS_LIST))
    {
        m_isList = json[JSON_IS_LIST].toBool();
    }
    if (m_isList)
    {
        m_list = new QStandardItemModel;
        SuperListItem::readList(m_list, new SystemCustomStructure, json,
            JSON_LIST);
    } else
    {
        m_properties = new QStandardItemModel;
        SuperListItem::readList(m_properties, new SystemCustomStructure, json,
            JSON_PROPERTIES);
    }
    this->initializeHeaders();
}

// -------------------------------------------------------

void SystemCustomStructure::write(QJsonObject &json) const {
    SuperListItem::write(json);

    if (m_isList != DEFAULT_IS_LIST)
    {
        json[JSON_IS_LIST] = m_isList;
    }
    if (m_properties != nullptr)
    {
        SuperListItem::writeTree(m_properties, json, JSON_PROPERTIES);
    }
    if (m_list != nullptr)
    {
        SuperListItem::writeTree(m_list, json, JSON_LIST);
    }
}

/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcustomstructureelement.h"
#include "dialogsystemcustomstructureelement.h"
#include "rpm.h"

const QString SystemCustomStructureElement::JSON_IS_PROPERTY = "ip";
const QString SystemCustomStructureElement::JSON_DESCRIPTION = "d";
const QString SystemCustomStructureElement::JSON_VALUE= "v";
const bool SystemCustomStructureElement::DEFAULT_IS_PROPERTY = true;
const QString SystemCustomStructureElement::DEFAULT_DESCRIPTION = "";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCustomStructureElement::SystemCustomStructureElement() :
    SystemCustomStructureElement(0, "")
{

}


SystemCustomStructureElement::SystemCustomStructureElement(int i, QString n,
    bool ip, PrimitiveValue *v) :
    SuperListItem(i, n),
    m_isProperty(ip),
    m_value(v)
{

}

QString SystemCustomStructureElement::description() const
{
    return m_description;
}

SystemCustomStructureElement::~SystemCustomStructureElement()
{
    delete m_value;
}

bool SystemCustomStructureElement::isProperty() const
{
    return m_isProperty;
}

PrimitiveValue * SystemCustomStructureElement::value() const
{
    return m_value;
}

void SystemCustomStructureElement::setIsProperty(bool isProperty)
{
    m_isProperty = isProperty;
}

void SystemCustomStructureElement::setDescription(QString description)
{
    m_description = description;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemCustomStructureElement::toString() const
{
    QString str;
    if (m_isProperty)
    {
        str += '"' + p_name + '"' + RPM::COLON;
    }
    str += m_value->toString();
    return str;
}

// -------------------------------------------------------

bool SystemCustomStructureElement::openDialog()
{
    SystemCustomStructureElement element;
    element.setCopy(*this);
    DialogSystemCustomStructureElement dialog(element);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(element);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemCustomStructureElement::createCopy() const
{
    SystemCustomStructureElement *super = new SystemCustomStructureElement;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCustomStructureElement::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);

    const SystemCustomStructureElement *element = reinterpret_cast<const
        SystemCustomStructureElement *>(&super);
    m_isProperty = element->m_isProperty;
    m_description = element->m_description;
    m_value->setCopy(*element->m_value);
}

// -------------------------------------------------------

QList<QStandardItem*> SystemCustomStructureElement::getModelRow() const
{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem *item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(SuperListItem::beginningText + (m_isProperty ? '"' + p_name +
        '"' : QString::number(p_id)));
    row.append(item);
    QStandardItem *itemName = new QStandardItem;
    itemName->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemName->setFlags(itemName->flags() ^ (Qt::ItemIsDropEnabled));
    itemName->setText(m_value->toString());
    row.append(itemName);
    return row;
}

// -------------------------------------------------------

void SystemCustomStructureElement::read(const QJsonObject &json)
{
    SuperListItem::read(json);

    if (json.contains(JSON_IS_PROPERTY))
    {
        m_isProperty = json[JSON_IS_PROPERTY].toBool();
    }
    if (json.contains(JSON_DESCRIPTION))
    {
        m_description = json[JSON_DESCRIPTION].toString();
    }
    if (json.contains(JSON_VALUE))
    {
        m_value->read(json[JSON_VALUE].toObject());
    }
}

// -------------------------------------------------------

void SystemCustomStructureElement::write(QJsonObject &json) const {
    SuperListItem::write(json);

    if (m_isProperty != DEFAULT_IS_PROPERTY)
    {
        json[JSON_IS_PROPERTY] = m_isProperty;
    }
    if (m_description != DEFAULT_DESCRIPTION)
    {
        json[JSON_DESCRIPTION] = m_description;
    }
    if (!m_value->isDefaultNumberDoubleValue())
    {
        QJsonObject obj;
        m_value->write(obj);
        json[JSON_VALUE] = obj;
    }
}

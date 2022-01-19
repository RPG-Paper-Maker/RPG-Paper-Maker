/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systempluginparameter.h"
#include "dialogsystempluginparameter.h"

const QString SystemPluginParameter::JSON_DESCRIPTION = "description";
const QString SystemPluginParameter::JSON_DEFAULT_VALUE = "defaultValue";
const QString SystemPluginParameter::DEFAULT_DESCRIPTION = "";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPluginParameter::SystemPluginParameter() :
    SystemPluginParameter(-1, "")
{

}

SystemPluginParameter::SystemPluginParameter(int i, QString n, bool id, QString
    d, PrimitiveValue *dv) :
    SuperListItem(i, n),
    m_description(d),
    m_defaultValue(dv),
    m_isDefault(id)
{

}

SystemPluginParameter::~SystemPluginParameter()
{
    delete m_defaultValue;
}

QString SystemPluginParameter::description() const
{
    return m_description;
}

PrimitiveValue * SystemPluginParameter::defaultValue() const
{
    return m_defaultValue;
}

bool SystemPluginParameter::isDefault() const
{
    return m_isDefault;
}

void SystemPluginParameter::setDescription(QString description)
{
    m_description = description;
}

void SystemPluginParameter::setIsDefault(bool isDefault)
{
    m_isDefault = isDefault;
}

// -------------------------------------------------------
//
//  STATIC FUNCTIONS
//
// -------------------------------------------------------

void SystemPluginParameter::setAllDefault(QStandardItemModel *model, bool def)
{
    QStandardItem *item;
    SystemPluginParameter *param;
    for (int i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        item = model->item(i);
        if (item != nullptr)
        {
            param = reinterpret_cast<SystemPluginParameter *>(item->data().value
                <quintptr>());
            if (param != nullptr)
            {
                param->setIsDefault(def);
            }
        }
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemPluginParameter::openDialog()
{
    SystemPluginParameter param;
    param.setCopy(*this);
    DialogSystemPluginParameter dialog(param);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(param);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemPluginParameter::createCopy() const
{
    SystemPluginParameter *super = new SystemPluginParameter;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemPluginParameter::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);

    const SystemPluginParameter *param = reinterpret_cast<const
        SystemPluginParameter *>(&super);
    m_description = param->m_description;
    m_defaultValue->setCopy(*param->m_defaultValue);
    m_isDefault = param->m_isDefault;
}

// -------------------------------------------------------

QList<QStandardItem*> SystemPluginParameter::getModelRow() const
{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem *itemName = new QStandardItem;
    itemName->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemName->setFlags(itemName->flags() ^ (Qt::ItemIsDropEnabled));
    itemName->setText(this->toStringName());
    row.append(itemName);
    QStandardItem *itemValue = new QStandardItem;
    itemValue->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    itemValue->setFlags(itemValue->flags() ^ (Qt::ItemIsDropEnabled));
    itemValue->setText(m_defaultValue->toString());
    row.append(itemValue);
    return row;
}

// -------------------------------------------------------

void SystemPluginParameter::read(const QJsonObject &json)
{
    SuperListItem::read(json);

    if (json.contains(JSON_DESCRIPTION))
    {
        m_description = json[JSON_DESCRIPTION].toString();
    }
    if (json.contains(JSON_DEFAULT_VALUE))
    {
        m_defaultValue->read(json[JSON_DEFAULT_VALUE].toObject());
    }
}

// -------------------------------------------------------

void SystemPluginParameter::write(QJsonObject &json) const {
    SuperListItem::write(json);

    if (m_description != DEFAULT_DESCRIPTION)
    {
        json[JSON_DESCRIPTION] = m_description;
    }
    if (!m_defaultValue->isDefaultNumberDoubleValue())
    {
        QJsonObject obj;
        m_defaultValue->write(obj);
        json[JSON_DEFAULT_VALUE] = obj;
    }
}

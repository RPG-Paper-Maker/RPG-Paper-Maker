/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systempluginparameter.h"

const QString SystemPluginParameter::JSON_NAME = "n";
const QString SystemPluginParameter::JSON_HELP = "h";
const QString SystemPluginParameter::JSON_DEFAULT_VALUE = "d";
const QString SystemPluginParameter::JSON_VALUE = "v";
const QString SystemPluginParameter::DEFAULT_NAME = "";
const QString SystemPluginParameter::DEFAULT_HELP = "";
const QString SystemPluginParameter::DEFAULT_DEFAULT_VALUE = "";
const QString SystemPluginParameter::DEFAULT_VALUE = "";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPluginParameter::SystemPluginParameter()
{

}

SystemPluginParameter::~SystemPluginParameter()
{

}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
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
    m_name = param->m_name;
    m_help = param->m_help;
    m_defaultValue = param->m_defaultValue;
    m_value = param->m_value;
}

// -------------------------------------------------------

void SystemPluginParameter::read(const QJsonObject &json)
{
    SuperListItem::read(json);


    if (json.contains(JSON_NAME))
    {
        m_name = json[JSON_NAME].toString();
    }
    if (json.contains(JSON_HELP))
    {
        m_help = json[JSON_HELP].toString();
    }
    if (json.contains(JSON_DEFAULT_VALUE))
    {
        m_defaultValue = json[JSON_DEFAULT_VALUE].toString();
    }
    if (json.contains(JSON_VALUE))
    {
        m_value = json[JSON_VALUE].toString();
    }
}

// -------------------------------------------------------

void SystemPluginParameter::write(QJsonObject &json) const {
    SuperListItem::write(json);

    if (m_name != DEFAULT_NAME)
    {
        json[JSON_NAME] = m_name;
    }
    if (m_help != DEFAULT_HELP)
    {
        json[JSON_HELP] = m_help;
    }
    if (m_defaultValue != DEFAULT_DEFAULT_VALUE)
    {
        json[JSON_DEFAULT_VALUE] = m_defaultValue;
    }
    if (m_value != DEFAULT_VALUE)
    {
        json[JSON_VALUE] = m_value;
    }
}

/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemplugin.h"
#include "systemplugincommand.h"
#include "systempluginparameter.h"
#include "dialogsystemplugin.h"
#include "common.h"
#include "rpm.h"

const QString SystemPlugin::JSON_TYPE = "t";
const QString SystemPlugin::JSON_CATEGORY = "c";
const QString SystemPlugin::JSON_AUTHOR = "a";
const QString SystemPlugin::JSON_WEBSITE = "w";
const QString SystemPlugin::JSON_DESCRIPTION = "d";
const QString SystemPlugin::JSON_VERSION = "v";
const QString SystemPlugin::JSON_TUTORIAL = "tu";
const QString SystemPlugin::JSON_PARAMETERS = "p";
const QString SystemPlugin::JSON_COMMANDS = "co";
const PluginTypeKind SystemPlugin::DEFAULT_TYPE = PluginTypeKind::Empty;
const PluginCategoryKind SystemPlugin::DEFAULT_CATEGORY = PluginCategoryKind
    ::Battle;
const QString SystemPlugin::DEFAULT_AUTHOR = "";
const QString SystemPlugin::DEFAULT_WEBSITE = "";
const QString SystemPlugin::DEFAULT_DESCRIPTION = "";
const QString SystemPlugin::DEFAULT_VERSION = "1.0";
const QString SystemPlugin::DEFAULT_TUTORIAL = "";
const QString SystemPlugin::NAME_CODE = "code" + RPM::EXTENSION_JS;
const QString SystemPlugin::NAME_JSON = "details" + RPM::EXTENSION_JSON;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPlugin::SystemPlugin() :
    SystemPlugin(1, "")
{

}

SystemPlugin::SystemPlugin(int i, QString n, PluginTypeKind t,
    PluginCategoryKind c, QString a, QString w, QString d, QString v, QString tu) :
    SystemScript(i, n),
    m_type(t),
    m_category(c),
    m_author(a),
    m_website(w),
    m_description(d),
    m_version(v),
    m_tutorial(tu),
    m_parameters(new QStandardItemModel),
    m_commands(new QStandardItemModel)
{

}

SystemPlugin::~SystemPlugin()
{
    SuperListItem::deleteModel(m_parameters);
    SuperListItem::deleteModel(m_commands);
}

PluginTypeKind SystemPlugin::type() const
{
    return m_type;
}

PluginCategoryKind SystemPlugin::category() const
{
    return m_category;
}

QString SystemPlugin::author() const
{
    return m_author;
}

QString SystemPlugin::website() const
{
    return m_website;
}

QString SystemPlugin::description() const
{
    return m_description;
}

QString SystemPlugin::version() const
{
    return m_version;
}

QString SystemPlugin::tutorial() const
{
    return m_tutorial;
}

int SystemPlugin::parametersCount() const
{
    return m_parameters->invisibleRootItem()->rowCount();
}

SystemPluginParameter * SystemPlugin::parameterAt(int i) const
{
    return reinterpret_cast<SystemPluginParameter *>(m_parameters->item(i)
        ->data().value<quintptr>());
}

int SystemPlugin::commandsCount() const
{
    return m_commands->invisibleRootItem()->rowCount();
}

SystemPluginParameter * SystemPlugin::commandAt(int i) const
{
    return reinterpret_cast<SystemPluginParameter *>(m_commands->item(i)
        ->data().value<quintptr>());
}

void SystemPlugin::setType(PluginTypeKind type)
{
    m_type = type;
}

void SystemPlugin::setCategory(PluginCategoryKind category)
{
    m_category = category;
}

void SystemPlugin::setAuthor(QString author)
{
    m_author = author;
}

void SystemPlugin::setWebsite(QString website)
{
    m_website = website;
}

void SystemPlugin::setDescription(QString description)
{
    m_description = description;
}

void SystemPlugin::setVersion(QString version)
{
    m_version = version;
}

void SystemPlugin::setTutorial(QString tutorial)
{
    m_tutorial = tutorial;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemPlugin::getFolderPath() const
{
    return Common::pathCombine(Common::pathCombine(RPM::get()->project()
        ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_PLUGINS_DIR), p_name);
}

// -------------------------------------------------------

void SystemPlugin::clearParameters()
{
    SuperListItem::deleteModel(m_parameters, false);
}

// -------------------------------------------------------

void SystemPlugin::clearCommands()
{
    SuperListItem::deleteModel(m_commands, false);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemPlugin::getPath() const
{
    return Common::pathCombine(this->getFolderPath(), NAME_CODE);
}

// -------------------------------------------------------

void SystemPlugin::setDefault()
{
    this->setType(DEFAULT_TYPE);
    this->setCategory(DEFAULT_CATEGORY);
    this->setAuthor(DEFAULT_AUTHOR);
    this->setWebsite(DEFAULT_WEBSITE);
    this->setDescription(DEFAULT_DESCRIPTION);
    this->setVersion(DEFAULT_VERSION);
    this->setTutorial(DEFAULT_TUTORIAL);
    this->clearParameters();
    this->clearCommands();
}

// -------------------------------------------------------

bool SystemPlugin::openDialog()
{
    SystemPlugin plugin;
    plugin.setCopy(*this);
    DialogSystemPlugin dialog(plugin);
    if (dialog.exec() == QDialog::Accepted)
    {
        this->setCopy(plugin);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemPlugin::createCopy() const
{
    SystemPlugin *super = new SystemPlugin;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemPlugin::setCopy(const SuperListItem &super)
{
    SystemScript::setCopy(super);

    const SystemPlugin *plugin = reinterpret_cast<const SystemPlugin *>(&super);
    m_type = plugin->m_type;
    m_category = plugin->m_category;
    m_author = plugin->m_author;
    m_website = plugin->m_website;
    m_description = plugin->m_description;
    m_version = plugin->m_version;
    m_tutorial = plugin->m_tutorial;
    this->clearParameters();
    SuperListItem::copy(m_parameters, plugin->m_parameters);
    this->clearCommands();
    SuperListItem::copy(m_commands, plugin->m_commands);
}

// -------------------------------------------------------

void SystemPlugin::read(const QJsonObject &json)
{
    SystemScript::read(json);

    // Clear model
    SuperListItem::deleteModel(m_parameters, false);
    SuperListItem::deleteModel(m_commands, false);

    if (json.contains(JSON_TYPE))
    {
        m_type = static_cast<PluginTypeKind>(json[JSON_TYPE].toInt());
    }
    if (json.contains(JSON_CATEGORY))
    {
        m_category = static_cast<PluginCategoryKind>(json[JSON_CATEGORY].toInt());
    }
    if (json.contains(JSON_AUTHOR))
    {
        m_author = json[JSON_AUTHOR].toString();
    }
    if (json.contains(JSON_WEBSITE))
    {
        m_website = json[JSON_WEBSITE].toString();
    }
    if (json.contains(JSON_DESCRIPTION))
    {
        m_description = json[JSON_DESCRIPTION].toString();
    }
    if (json.contains(JSON_VERSION))
    {
        m_version = json[JSON_VERSION].toString();
    }
    if (json.contains(JSON_TUTORIAL))
    {
        m_tutorial = json[JSON_TUTORIAL].toString();
    }
    SuperListItem::readTree(m_parameters, new SystemPluginParameter, json,
        JSON_PARAMETERS);
    SuperListItem::readTree(m_commands, new SystemPluginCommand, json,
        JSON_COMMANDS);
}

// -------------------------------------------------------

void SystemPlugin::write(QJsonObject &json) const {
    SystemScript::write(json);

    if (m_type != DEFAULT_TYPE)
    {
        json[JSON_TYPE] = static_cast<int>(m_type);
    }
    if (m_category != DEFAULT_CATEGORY)
    {
        json[JSON_CATEGORY] = static_cast<int>(m_category);
    }
    if (m_author != DEFAULT_AUTHOR)
    {
        json[JSON_AUTHOR] = m_author;
    }
    if (m_description != DEFAULT_DESCRIPTION)
    {
        json[JSON_DESCRIPTION] = m_description;
    }
    if (m_version != DEFAULT_VERSION)
    {
        json[JSON_VERSION] = m_version;
    }
    SuperListItem::writeTree(m_parameters, json, JSON_PARAMETERS);
    SuperListItem::writeTree(m_commands, json, JSON_COMMANDS);
}

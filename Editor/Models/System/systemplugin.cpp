/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include "systemplugin.h"
#include "systemplugincommand.h"
#include "systempluginparameter.h"
#include "dialogsystemplugin.h"
#include "common.h"
#include "rpm.h"

const QString SystemPlugin::JSON_CATEGORY_BATTLE = "battle";
const QString SystemPlugin::JSON_CATEGORY_MENUS = "menus";
const QString SystemPlugin::JSON_CATEGORY_MAP = "map";
const QString SystemPlugin::JSON_CATEGORY_OTHERS = "others";
const QString SystemPlugin::JSON_IS_ON = "isOn";
const QString SystemPlugin::JSON_TYPE = "type";
const QString SystemPlugin::JSON_CATEGORY = "category";
const QString SystemPlugin::JSON_AUTHOR = "author";
const QString SystemPlugin::JSON_WEBSITE = "website";
const QString SystemPlugin::JSON_DESCRIPTION = "description";
const QString SystemPlugin::JSON_VERSION = "version";
const QString SystemPlugin::JSON_TUTORIAL = "tutorial";
const QString SystemPlugin::JSON_DEFAULT_PARAMETERS = "defaultParameters";
const QString SystemPlugin::JSON_PARAMETERS = "parameters";
const QString SystemPlugin::JSON_COMMANDS = "commands";
const bool SystemPlugin::DEFAULT_IS_ON = true;
const PluginTypeKind SystemPlugin::DEFAULT_TYPE = PluginTypeKind::Empty;
const PluginCategoryKind SystemPlugin::DEFAULT_CATEGORY = PluginCategoryKind
    ::Battle;
const QString SystemPlugin::DEFAULT_AUTHOR = "";
const QString SystemPlugin::DEFAULT_WEBSITE = "";
const QString SystemPlugin::DEFAULT_DESCRIPTION = "";
const QString SystemPlugin::DEFAULT_VERSION = "1.0.0";
const QString SystemPlugin::DEFAULT_TUTORIAL = "";
const QString SystemPlugin::NAME_CODE = "code.js";
const QString SystemPlugin::NAME_JSON = "details.json";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPlugin::SystemPlugin() :
    SystemPlugin(1, "")
{

}

SystemPlugin::SystemPlugin(int i, QString n, bool io, PluginTypeKind t,
    PluginCategoryKind c, QString a, QString w, QString d, QString v, QString tu) :
    SystemScript(i, n),
    m_displayIsOn(true),
    m_isON(io),
    m_type(t),
    m_category(c),
    m_author(a),
    m_website(w),
    m_description(d),
    m_version(v),
    m_tutorial(tu),
    m_defaultParameters(new QStandardItemModel),
    m_parameters(new QStandardItemModel),
    m_commands(new QStandardItemModel),
    m_editChanged(false),
    m_defaultParametersChanged(false),
    m_editedPlugin(nullptr),
    m_isOnline(false)
{
    m_displayID = true;
    m_editable = true;
    this->initializeHeaders();
}

SystemPlugin::~SystemPlugin()
{
    SuperListItem::deleteModel(m_defaultParameters);
    SuperListItem::deleteModel(m_parameters);
    SuperListItem::deleteModel(m_commands);
    this->removeEditedPlugin();
}

bool SystemPlugin::displayIsOn() const
{
    return m_displayIsOn;
}

bool SystemPlugin::isON() const
{
    return m_isON;
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

QStandardItemModel * SystemPlugin::defaultParameters() const
{
    return m_defaultParameters;
}

QStandardItemModel * SystemPlugin::parameters() const
{
    return m_parameters;
}

QStandardItemModel * SystemPlugin::commands() const
{
    return m_commands;
}

bool SystemPlugin::editChanged() const
{
    return m_editChanged;
}

bool SystemPlugin::defaultParametersChanged() const
{
    return m_defaultParametersChanged;
}

SystemPlugin * SystemPlugin::editedPlugin() const
{
    return m_editedPlugin;
}

bool SystemPlugin::isOnline() const
{
    return m_isOnline;
}

void SystemPlugin::setDisplayIsOn(bool displayIsOn)
{
    m_displayIsOn = displayIsOn;
}

void SystemPlugin::setIsON(bool isON)
{
    m_isON = isON;
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

void SystemPlugin::setEditChanged(bool editChanged)
{
    m_editChanged = editChanged;
}

void SystemPlugin::setDefaultParametersChanged(bool parametersChanged)
{
    m_defaultParametersChanged = parametersChanged;
}

void SystemPlugin::setIsOnline(bool isOnline)
{
    m_isOnline = isOnline;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemPlugin::getJSONCategory() const
{
    switch (m_category)
    {
    case PluginCategoryKind::Battle:
        return JSON_CATEGORY_BATTLE;
    case PluginCategoryKind::Menus:
        return JSON_CATEGORY_MENUS;
    case PluginCategoryKind::Map:
        return JSON_CATEGORY_MAP;
    case PluginCategoryKind::Others:
        return JSON_CATEGORY_OTHERS;
    }
    return "";
}

// -------------------------------------------------------

QString SystemPlugin::getFolderPath() const
{
    return Common::pathCombine(Common::pathCombine(RPM::get()->project()
        ->pathCurrentProjectApp(), RPM::PATH_SCRIPTS_PLUGINS_DIR), p_name);
}

// -------------------------------------------------------

QString SystemPlugin::getJSONPath() const
{
    return Common::pathCombine(this->getFolderPath(), NAME_JSON);
}

// -------------------------------------------------------

bool SystemPlugin::checkPluginName(QString previousName) const
{
    if (p_name.isEmpty())
    {
        QMessageBox::information(nullptr, RPM::translate(Translations
            ::WARNING), "The plugin name can't be empty.");
        return false;
    }
    if (previousName != p_name && RPM::get()->project()->scriptsDatas()
        ->containsPluginName(p_name))
    {
        QMessageBox::information(nullptr, RPM::translate(Translations
            ::WARNING), "This plugin name already exists in your project.");
        return false;
    }
    return true;
}

// -------------------------------------------------------

void SystemPlugin::readFromPath()
{
    RPM::readJSON(this->getJSONPath(), *this);
}

// -------------------------------------------------------

void SystemPlugin::initializeEditedPlugin()
{
    if (m_editedPlugin == nullptr)
    {
        m_editedPlugin = reinterpret_cast<SystemPlugin *>(this->createCopy());
    }
}

// -------------------------------------------------------

void SystemPlugin::initializeHeaders()
{
    m_defaultParameters->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::NAME), RPM::translate(Translations::DEFAULT_VALUE)}));
    m_parameters->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::NAME), RPM::translate(Translations::VALUE)}));
    m_commands->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::NAME) + RPM::PARENTHESIS_LEFT + RPM::BRACKET_LEFT + RPM
        ::translate(Translations::PARAMETERS) + RPM::BRACKET_RIGHT + RPM
        ::PARENTHESIS_RIGHT}));
}

// -------------------------------------------------------

void SystemPlugin::clearDefaultParameters()
{
    SuperListItem::deleteModel(m_defaultParameters, false);
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

void SystemPlugin::removeEditedPlugin()
{
    if (m_editedPlugin != nullptr)
    {
        delete m_editedPlugin;
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemPlugin::checkChanged() const
{
    return m_changed || m_editChanged;
}

// -------------------------------------------------------

QString SystemPlugin::getPath() const
{
    return Common::pathCombine(this->getFolderPath(), NAME_CODE);
}

// -------------------------------------------------------

void SystemPlugin::setDefault()
{
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

        // Also copy the edited plugin
        if (plugin.editedPlugin() == nullptr)
        {
            m_editedPlugin = nullptr;
        } else
        {
            if (m_editedPlugin == nullptr)
            {
                m_editedPlugin = reinterpret_cast<SystemPlugin *>(this
                    ->createCopy());
            } else
            {
                m_editedPlugin->setCopy(*this);
            }
        }
        m_changed = false;
        m_editChanged = false;
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
    m_isON = plugin->m_isON;
    m_type = plugin->m_type;
    m_category = plugin->m_category;
    m_author = plugin->m_author;
    m_website = plugin->m_website;
    m_description = plugin->m_description;
    m_version = plugin->m_version;
    m_tutorial = plugin->m_tutorial;
    m_isOnline = plugin->m_isOnline;
    this->clearDefaultParameters();
    SuperListItem::copy(m_defaultParameters, plugin->m_defaultParameters);
    this->clearParameters();
    SuperListItem::copy(m_parameters, plugin->m_parameters);
    this->clearCommands();
    SuperListItem::copy(m_commands, plugin->m_commands);
    this->initializeHeaders();
}

// -------------------------------------------------------

QList<QStandardItem*> SystemPlugin::getModelRow() const
{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    if (m_displayIsOn)
    {
        item->setCheckable(true);
        if (m_isON)
        {
            item->setCheckState(Qt::Checked);
        }
    }
    item->setText(this->toString());
    row.append(item);
    return row;
}

// -------------------------------------------------------

void SystemPlugin::read(const QJsonObject &json)
{
    SystemScript::read(json);

    // Clear model
    SuperListItem::deleteModel(m_defaultParameters, false);
    SuperListItem::deleteModel(m_parameters, false);
    SuperListItem::deleteModel(m_commands, false);

    if (json.contains(JSON_IS_ON))
    {
        m_isON = json[JSON_IS_ON].toBool();
    }
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
    SuperListItem::readTree(m_defaultParameters, new SystemPluginParameter, json,
        JSON_DEFAULT_PARAMETERS);
    SuperListItem::readTree(m_parameters, new SystemPluginParameter, json,
        JSON_PARAMETERS);
    SystemPluginParameter::setAllDefault(m_parameters, false);
    SuperListItem::readTree(m_commands, new SystemPluginCommand, json,
        JSON_COMMANDS);
}

// -------------------------------------------------------

void SystemPlugin::write(QJsonObject &json) const {
    SystemScript::write(json);

    if (m_isON != DEFAULT_IS_ON)
    {
        json[JSON_IS_ON] = m_isON;
    }
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
    if (m_website != DEFAULT_WEBSITE)
    {
        json[JSON_WEBSITE] = m_website;
    }
    if (m_description != DEFAULT_DESCRIPTION)
    {
        json[JSON_DESCRIPTION] = m_description;
    }
    if (m_version != DEFAULT_VERSION)
    {
        json[JSON_VERSION] = m_version;
    }
    if (m_tutorial != DEFAULT_TUTORIAL)
    {
        json[JSON_TUTORIAL] = m_tutorial;
    }
    SuperListItem::writeTree(m_defaultParameters, json, JSON_DEFAULT_PARAMETERS);
    SuperListItem::writeTree(m_parameters, json, JSON_PARAMETERS);
    SuperListItem::writeTree(m_commands, json, JSON_COMMANDS);
}

/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemplugin.h"
#include "dialogsystemplugin.h"

const QString SystemPlugin::JSON_TYPE = "t";
const QString SystemPlugin::JSON_CATEGORY = "c";
const QString SystemPlugin::JSON_AUTHOR = "a";
const QString SystemPlugin::JSON_WEBSITE = "w";
const QString SystemPlugin::JSON_DESCRIPTION = "d";
const QString SystemPlugin::JSON_VERSION = "v";
const QString SystemPlugin::JSON_TUTORIAL = "tu";
const QString SystemPlugin::JSON_PARAMETERS = "p";
const PluginTypeKind SystemPlugin::DEFAULT_TYPE = PluginTypeKind::Empty;
const PluginCategoryKind SystemPlugin::DEFAULT_CATEGORY = PluginCategoryKind
    ::Battle;
const QString SystemPlugin::DEFAULT_AUTHOR = "";
const QString SystemPlugin::DEFAULT_WEBSITE = "";
const QString SystemPlugin::DEFAULT_DESCRIPTION = "";
const QString SystemPlugin::DEFAULT_VERSION = "1.0";
const QString SystemPlugin::DEFAULT_TUTORIAL = "";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPlugin::SystemPlugin() :
    SystemPlugin(1, "")
{

}

SystemPlugin::SystemPlugin(int i, QString n, PluginTypeKind t, PluginCategoryKind c,
    QString a, QString w, QString d, QString v, QString tu) :
    SystemScript(i, n),
    m_type(t),
    m_category(c),
    m_author(a),
    m_website(w),
    m_description(d),
    m_version(v),
    m_tutorial(tu),
    m_parameters(new QStandardItemModel)
{

}

SystemPlugin::~SystemPlugin()
{
    SuperListItem::deleteModel(m_parameters);
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

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
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
    const SystemPlugin *plugin;

    plugin = reinterpret_cast<const SystemPlugin *>(&super);
    m_type = plugin->m_type;
    m_category = plugin->m_category;
    m_author = plugin->m_author;
    m_website = plugin->m_website;
    m_description = plugin->m_description;
    m_version = plugin->m_version;
    m_tutorial = plugin->m_tutorial;
    SuperListItem::deleteModel(m_parameters, false);
    for (int i = 0, l = plugin->parametersCount(); i < l; i++)
    {
        m_parameters->appendRow(reinterpret_cast<SystemPluginParameter *>(plugin
            ->parameterAt(i)->createCopy())->getModelRow());
    }
}

// -------------------------------------------------------

void SystemPlugin::read(const QJsonObject &json)
{
    SystemScript::read(json);

    // Clear model
    SuperListItem::deleteModel(m_parameters, false);

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
    if (json.contains(JSON_PARAMETERS))
    {
        QJsonObject obj;
        QJsonArray tab = json[JSON_PARAMETERS].toArray();
        SystemPluginParameter *parameter;
        for (int i = 0, l = tab.size(); i < l; i++)
        {
            obj = tab.at(i).toObject();
            parameter = new SystemPluginParameter;
            parameter->read(obj);
            m_parameters->appendRow(parameter->getModelRow());
        }
    }
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
    QJsonArray tab;
    QJsonObject obj;
    SystemPluginParameter *parameter;
    for (int i = 0, l = this->parametersCount(); i < l; i++)
    {
        obj = QJsonObject();
        parameter = this->parameterAt(i);
        parameter->write(obj);
        tab.append(obj);
    }
    if (!tab.isEmpty())
    {
        json[JSON_PARAMETERS] = tab;
    }
}

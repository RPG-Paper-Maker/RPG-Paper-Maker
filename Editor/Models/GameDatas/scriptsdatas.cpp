/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QDir>
#include "scriptsdatas.h"
#include "systemscript.h"
#include "systemplugin.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ScriptsDatas::ScriptsDatas() :
    m_modelSystem(new QStandardItemModel),
    m_modelPlugins(new QStandardItemModel),
    m_modelLibs(new QStandardItemModel),
    m_modelShaders(new QStandardItemModel)
{

}

ScriptsDatas::~ScriptsDatas()
{
    SuperListItem::deleteModel(m_modelSystem);
    SuperListItem::deleteModel(m_modelPlugins);
    SuperListItem::deleteModel(m_modelLibs);
    SuperListItem::deleteModel(m_modelShaders);
}

void ScriptsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_SCRIPTS), *this);
}

QStandardItemModel * ScriptsDatas::modelSystem() const {
    return m_modelSystem;
}

QStandardItemModel * ScriptsDatas::modelLibs() const {
    return m_modelLibs;
}

QStandardItemModel * ScriptsDatas::modelShaders() const {
    return m_modelShaders;
}

QStandardItemModel* ScriptsDatas::modelPlugins() const {
    return m_modelPlugins;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool ScriptsDatas::containsPluginName(QString name) const
{
    return SuperListItem::containsName(m_modelPlugins, name);
}

// -------------------------------------------------------

bool ScriptsDatas::allScriptsSaved() const
{
    SystemScript *script;
    for (int i = 0; i < m_modelSystem->invisibleRootItem()->rowCount(); i++)
    {
        script = reinterpret_cast<SystemScript *>(m_modelSystem->item(i)
            ->data().value<quintptr>());
        if (script != nullptr && script->checkChanged())
        {
            return false;
        }
    }
    return true;
}

// -------------------------------------------------------

bool ScriptsDatas::allPluginsSaved() const
{
    SystemPlugin *plugin;
    for (int i = 0; i < m_modelPlugins->invisibleRootItem()->rowCount(); i++)
    {
        plugin = reinterpret_cast<SystemPlugin *>(m_modelPlugins->item(i)
            ->data().value<quintptr>());
        if (plugin != nullptr && plugin->checkChanged())
        {
            return false;
        }
    }
    return true;
}

// -------------------------------------------------------

void ScriptsDatas::setDefault(){
    m_modelPlugins->appendRow(SuperListItem::getEmptyItem());
}

// -------------------------------------------------------

void ScriptsDatas::readSystem()
{
    SuperListItem::deleteModel(m_modelSystem, false);
    this->readFolder(m_modelSystem->invisibleRootItem(), Common::pathCombine(RPM
        ::get()->project()->pathCurrentProjectApp(), RPM
        ::PATH_SCRIPTS_SYSTEM_DIR));
}

// -------------------------------------------------------

void ScriptsDatas::readLibs()
{
    SuperListItem::deleteModel(m_modelLibs, false);
    this->readFolder(m_modelLibs->invisibleRootItem(), Common::pathCombine(RPM
        ::get()->project()->pathCurrentProjectApp(), RPM
        ::PATH_SCRIPTS_LIBS_DIR));
}

// -------------------------------------------------------

void ScriptsDatas::readShaders()
{
    SuperListItem::deleteModel(m_modelShaders, false);
    this->readFolder(m_modelShaders->invisibleRootItem(), Common::pathCombine(
        RPM::get()->project()->pathCurrentProjectApp(), RPM
        ::PATH_SCRIPTS_SHADERS_DIR));
}

// -------------------------------------------------------

void ScriptsDatas::readFolder(QStandardItem *root, QString path)
{
    QDir dir(path);
    QIcon icon(":/icons/Ressources/dir.png");
    QStandardItem *item;
    SystemScript *script;
    foreach (QFileInfo id, dir.entryInfoList(QDir::Dirs | QDir::NoDotAndDotDot))
    {
        QString d = id.fileName();
        item = new QStandardItem;
        item->setData(QVariant::fromValue(nullptr));
        item->setIcon(icon);
        item->setText(d);
        root->appendRow(item);
        this->readFolder(item, Common::pathCombine(path, d));
    }
    foreach (QFileInfo ifo, dir.entryInfoList(QDir::Files))
    {
        QString f = ifo.fileName();
        item = new QStandardItem;
        script = new SystemScript(-1, f);
        script->setCurrentCode(Common::read(Common::pathCombine(path, f)));
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(script)));
        item->setText(f);
        root->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void ScriptsDatas::read(const QJsonObject &json)
{
    QJsonArray tab;

    // Clear
    SuperListItem::deleteModel(m_modelPlugins, false);

    this->readSystem();
    this->readLibs();
    this->readShaders();

    // Plugins
    QList<QStandardItem*> row;
    SystemPlugin *plugin;
    SuperListItem super;
    tab = json["plugins"].toArray();
    for (int i = 0; i < tab.size(); i++) {
        super.read(tab.at(i).toObject());
        plugin = new SystemPlugin(super.id(), super.name());
        plugin->readFromPath();
        m_modelPlugins->appendRow(plugin->getModelRow());
    }
    m_modelPlugins->appendRow(SuperListItem::getEmptyItem());
}

// -------------------------------------------------------

void ScriptsDatas::write(QJsonObject &json) const
{
    // Plugins
    QJsonArray tab = QJsonArray();
    SuperListItem *super;
    QJsonObject obj;
    for (int i = 0; i < m_modelPlugins->invisibleRootItem()->rowCount(); i++)
    {
        super = reinterpret_cast<SuperListItem *>(m_modelPlugins->item(i)
            ->data().value<quintptr>());
        if (super != nullptr)
        {
            obj = QJsonObject();
            super->SuperListItem::write(obj);
            tab.append(obj);
        } else
        {
            m_modelPlugins->removeRow(i--);
        }
    }
    m_modelPlugins->appendRow(SuperListItem::getEmptyItem());
    if (!tab.isEmpty())
    {
        json["plugins"] = tab;
    }
}

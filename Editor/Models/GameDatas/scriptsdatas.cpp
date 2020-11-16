/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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
    m_modelPlugins(new QStandardItemModel)
{

}

ScriptsDatas::~ScriptsDatas()
{
    SuperListItem::deleteModel(m_modelSystem, true);
    SuperListItem::deleteModel(m_modelPlugins, true);
}

void ScriptsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_SCRIPTS), *this);
}

QStandardItemModel* ScriptsDatas::modelSystem() const { return m_modelSystem; }

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
    QVector<QString> list({
        "platform.js",
        "enums.js",
        "node.js",
        "tree.js",
        "chrono.js",
        "frame.js",
        "texture-several.js",
        "songs-manager.js",
        "datas-pictures.js",
        "datas-videos.js",
        "datas-songs.js",
        "datas-shapes.js",
        "datas-common-events.js",
        "datas-items.js",
        "datas-weapons.js",
        "datas-armors.js",
        "datas-skills.js",
        "datas-classes.js",
        "datas-special-elements.js",
        "datas-tilesets.js",
        "datas-heroes.js",
        "datas-monsters.js",
        "datas-troops.js",
        "datas-system.js",
        "datas-battle-system.js",
        "datas-titlescreen-gameover.js",
        "datas-keyboard.js",
        "datas-animations.js",
        "datas-game.js",
        "settings.js",
        "system-lang.js",
        "system-color.js",
        "system-picture.js",
        "system-video.js",
        "system-shape.js",
        "system-icon.js",
        "system-song.js",
        "system-play-song.js",
        "system-camera-properties.js",
        "system-window-skin.js",
        "system-detection.js",
        "system-parameter.js",
        "system-event.js",
        "system-object-state.js",
        "system-object-event.js",
        "system-object-reaction.js",
        "system-common-reaction.js",
        "system-property.js",
        "system-object.js",
        "system-cost.js",
        "system-effect.js",
        "system-characteristic.js",
        "system-common-skill-item.js",
        "system-skill.js",
        "system-item.js",
        "system-armor.js",
        "system-weapon.js",
        "system-class.js",
        "system-special-element.js",
        "system-mountain.js",
        "system-object-3d.js",
        "system-tileset.js",
        "system-statistic-progression.js",
        "system-class-skill.js",
        "system-hero.js",
        "system-monster-action.js",
        "system-monster.js",
        "system-troop.js",
        "system-statistic.js",
        "system-element.js",
        "system-weapon-armor-kind.js",
        "system-keyboard.js",
        "system-currency.js",
        "system-skybox.js",
        "system-loot.js",
        "system-progression-table.js",
        "system-battle-map.js",
        "system-title-command.js",
        "system-animation.js",
        "system-animation-frame.js",
        "system-animation-frame-element.js",
        "system-animation-frame-effect.js",
        "system-value.js",
        "game.js",
        "game-stack.js",
        "game-player.js",
        "game-item.js",
        "game-skill.js",
        "event-command.js",
        "event-command-2.js",
        "reaction-interpreter.js",
        "battler.js",
        "map-object.js",
        "map-portion.js",
        "camera.js",
        "map-element.js",
        "map-properties.js",
        "land.js",
        "floor.js",
        "autotile.js",
        "autotiles.js",
        "sprite.js",
        "sprite-wall.js",
        "mountain.js",
        "mountains.js",
        "object-3d-box.js",
        "object-3d-custom.js",
        "collision-square.js",
        "collisions-utilities.js",
        "bitmap.js",
        "picture2d.js",
        "window-box.js",
        "window-choices.js",
        "graphic-text.js",
        "graphic-text-icon.js",
        "graphic-player.js",
        "graphic-time-currencies.js",
        "graphic-player-description.js",
        "graphic-skill-item.js",
        "graphic-use-skill-item.js",
        "graphic-item.js",
        "graphic-skill.js",
        "graphic-equip.js",
        "graphic-equip-stats.js",
        "graphic-save.js",
        "graphic-xp-progression.js",
        "graphic-loots.js",
        "graphic-statistic-progression.js",
        "graphic-rewards-top.js",
        "graphic-setting.js",
        "graphic-keyboard.js",
        "graphic-message.js",
        "scene-game.js",
        "scene-loading.js",
        "scene-title-screen.js",
        "scene-save-load-game.js",
        "scene-save-game.js",
        "scene-load-game.js",
        "scene-title-settings.js",
        "scene-keyboard-assign.js",
        "scene-map.js",
        "scene-menu.js",
        "scene-menu-inventory.js",
        "scene-menu-skills.js",
        "scene-menu-equip.js",
        "scene-description-state.js",
        "scene-battle.js",
        "scene-battle-0.js",
        "scene-battle-1.js",
        "scene-battle-2.js",
        "scene-battle-3.js",
        "scene-battle-4.js",
        "rpm.js",
        "main.js",
    });

    for (int i = 0; i < list.size(); i++)
    {
        m_modelSystem->appendRow((new SystemScript(-1, list.at(i)))
            ->getModelRow());
    }
    m_modelSystem->appendRow(SuperListItem::getEmptyItem());
    m_modelPlugins->appendRow(SuperListItem::getEmptyItem());
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
    SuperListItem::deleteModel(m_modelSystem, false);
    SuperListItem::deleteModel(m_modelPlugins, false);

    // System
    tab = json["system"].toArray();
    for (int i = 0; i < tab.size(); i++)
    {
        m_modelSystem->appendRow((new SystemScript(1, tab.at(i).toString()))
            ->getModelRow());
    }
    m_modelSystem->appendRow(SuperListItem::getEmptyItem());

    // Plugins
    QList<QStandardItem*> row;
    SystemPlugin *plugin;
    tab = json["plugins"].toArray();
    for (int i = 0; i < tab.size(); i++) {
        plugin = new SystemPlugin(-1, tab.at(i).toString());
        plugin->readFromPath();
        m_modelPlugins->appendRow(plugin->getModelRow());
    }
    m_modelPlugins->appendRow(SuperListItem::getEmptyItem());
}

// -------------------------------------------------------

void ScriptsDatas::write(QJsonObject &json) const
{
    // System
    SuperListItem *super;
    QJsonArray tab;
    for (int i = 0; i < m_modelSystem->invisibleRootItem()->rowCount(); i++)
    {
        super = reinterpret_cast<SuperListItem *>(m_modelSystem->item(i)
            ->data().value<quintptr>());
        if (super != nullptr)
        {
            tab.append(super->name());
        } else
        {
            m_modelSystem->removeRow(i--);
        }
    }
    m_modelSystem->appendRow(SuperListItem::getEmptyItem());
    if (!tab.isEmpty())
    {
        json["system"] = tab;
    }

    // Plugins
    tab = QJsonArray();
    for (int i = 0; i < m_modelPlugins->invisibleRootItem()->rowCount(); i++)
    {
        super = reinterpret_cast<SuperListItem *>(m_modelPlugins->item(i)
            ->data().value<quintptr>());
        if (super != nullptr)
        {
            tab.append(super->name());
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

// -------------------------------------------------------

void ScriptsDatas::writeDesktop(QString path) const{
    path = Common::pathCombine(path, RPM::PATH_SCRIPTS_DIR);
    QDir(path).mkdir(RPM::FOLDER_DESKTOP);
    path = Common::pathCombine(path, Common::pathCombine(RPM::FOLDER_DESKTOP,
                                                       "includes.js"));

    QFile writeInfos(path);
    if(!writeInfos.open(QIODevice::Append | QIODevice::Text))
        return;

    QTextStream out(&writeInfos);

    for (int i = 0; i < m_modelSystem->invisibleRootItem()->rowCount(); i++)
        out << "Qt.include(\"../" << m_modelSystem->item(i)->text() <<
               ".js\")\n";

    writeInfos.close();
}

// -------------------------------------------------------

void ScriptsDatas::writeBrowser(QString path) const{
    path = Common::pathCombine(path, "includes.html");

    QFile writeInfos(path);
    if(!writeInfos.open(QIODevice::Append | QIODevice::Text))
        return;

    QTextStream out(&writeInfos);

    for (int i = 0; i < m_modelSystem->invisibleRootItem()->rowCount(); i++){
        out << "<script type=\"text/javascript\" src=\"Content/Datas/Scripts/"
            << m_modelSystem->item(i)->text()
            << ".js\"></script>\n";
    }

    writeInfos.close();
}

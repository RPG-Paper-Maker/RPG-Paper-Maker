/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "scriptsdatas.h"
#include "rpm.h"
#include "common.h"
#include <QDir>

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
    delete m_modelSystem;
     delete m_modelPlugins;
}

void ScriptsDatas::read(QString path){
    RPM::readJSON(Common::pathCombine(path, RPM::pathScripts), *this);
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

void ScriptsDatas::setDefault(){
    QVector<QString> list({
                          "RPM",
                          "utilities",
                          "datas-game",
                          "datas-common-events",
                          "datas-items",
                          "datas-weapons",
                          "datas-armors",
                          "datas-skills",
                          "datas-classes",
                          "datas-heroes",
                          "datas-monsters",
                          "datas-troops",
                          "datas-system",
                          "datas-battle-system",
                          "datas-keyboard",
                          "system-parameter",
                          "system-event",
                          "system-common-reaction",
                          "system-object-state",
                          "system-object-event",
                          "system-object-reaction",
                          "system-object",
                          "system-item",
                          "system-weapon",
                          "system-armor",
                          "system-skill",
                          "system-class",
                          "system-statistic-progression",
                          "system-class-skill",
                          "system-hero",
                          "system-monster",
                          "system-troop",
                          "system-statistic",
                          "system-element",
                          "system-weapon-armor-kind",
                          "system-keyboard",
                          "system-value",
                          "game",
                          "game-stack",
                          "game-player",
                          "game-item",
                          "game-skill",
                          "event-command",
                          "event-command-2",
                          "reaction-interpreter",
                          "battler",
                          "map-object",
                          "map-portion",
                          "camera",
                          "sprite",
                          "bitmap",
                          "window-box",
                          "window-choices",
                          "graphic-text",
                          "graphic-player",
                          "graphic-player-description",
                          "graphic-item",
                          "graphic-skill",
                          "graphic-equip",
                          "graphic-equip-stats",
                          "scene-game",
                          "scene-title-screen",
                          "scene-save-load-game",
                          "scene-save-game",
                          "scene-load-game",
                          "scene-map",
                          "scene-menu",
                          "scene-menu-inventory",
                          "scene-menu-skills",
                          "scene-menu-equip",
                          "scene-description-state",
                          "scene-battle",
                          "scene-battle-0",
                          "scene-battle-1",
                          "scene-battle-2",
                          "scene-battle-3",
                          "scene-battle-4",
                          "main"
    });

    for (int i = 0; i < list.size(); i++){
        QStandardItem* item = new QStandardItem;
        item->setText(list.at(i));
        m_modelSystem->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void ScriptsDatas::read(const QJsonObject &json){
    QJsonArray tab = json["system"].toArray();

    // Clear
    m_modelSystem->clear();
    m_modelPlugins->clear();

    // System
    for (int i = 0; i < tab.size(); i++){
        QStandardItem* item = new QStandardItem;
        item->setText(tab.at(i).toString());
        m_modelSystem->appendRow(item);
    }
    tab = json["plugins"].toArray();

    // Plugins
    for (int i = 0; i < tab.size(); i++){
        QStandardItem* item = new QStandardItem;
        item->setText(tab.at(i).toString());
        m_modelPlugins->appendRow(item);
    }
    tab = json["plugins"].toArray();
}

// -------------------------------------------------------

void ScriptsDatas::write(QJsonObject &json) const{
    QJsonArray tab;

    // System
    for (int i = 0; i < m_modelSystem->invisibleRootItem()->rowCount(); i++){
        tab.append(m_modelSystem->item(i)->text());
    }
    json["system"] = tab;

    // Plugins
    for (int i = 0; i < m_modelPlugins->invisibleRootItem()->rowCount(); i++){
        tab.append(m_modelPlugins->item(i)->text());
    }
    json["plugins"] = tab;
}

// -------------------------------------------------------

void ScriptsDatas::writeDesktop(QString path) const{
    path = Common::pathCombine(path, RPM::pathScriptsDir);
    QDir(path).mkdir(RPM::dirDesktop);
    path = Common::pathCombine(path, Common::pathCombine(RPM::dirDesktop,
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

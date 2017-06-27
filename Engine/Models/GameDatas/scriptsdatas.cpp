/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "scriptsdatas.h"
#include "wanok.h"
#include <QDir>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ScriptsDatas::ScriptsDatas() :
    m_model(new QStandardItemModel)
{

}

ScriptsDatas::~ScriptsDatas()
{
    delete m_model;
}

void ScriptsDatas::read(QString path){
    Wanok::readJSON(Wanok::pathCombine(path, Wanok::pathScripts), *this);
}

QStandardItemModel* ScriptsDatas::model() const { return m_model; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ScriptsDatas::setDefault(){
    QVector<QString> list({
                              "wanok",
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
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void ScriptsDatas::read(const QJsonObject &json){
    QJsonArray tab = json["l"].toArray();

    // Clear
    m_model->clear();

    // Read
    for (int i = 0; i < tab.size(); i++){
        QStandardItem* item = new QStandardItem;
        item->setText(tab.at(i).toString());
        m_model->appendRow(item);
    }
}

// -------------------------------------------------------

void ScriptsDatas::write(QJsonObject &json) const{
    QJsonArray tab;

    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        tab.append(m_model->item(i)->text());
    }
    json["l"] = tab;
}

// -------------------------------------------------------

void ScriptsDatas::writeDesktop(QString path) const{
    path = Wanok::pathCombine(path, Wanok::pathScriptsDir);
    QDir(path).mkdir(Wanok::dirDesktop);
    path = Wanok::pathCombine(path, Wanok::pathCombine(Wanok::dirDesktop,
                                                       "includes.js"));

    QFile writeInfos(path);
    if(!writeInfos.open(QIODevice::Append | QIODevice::Text))
        return;

    QTextStream out(&writeInfos);

    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++)
        out << "Qt.include(\"../" << m_model->item(i)->text() << ".js\")\n";

    writeInfos.close();
}

// -------------------------------------------------------

void ScriptsDatas::writeBrowser(QString path) const{
    path = Wanok::pathCombine(path, "includes.html");

    QFile writeInfos(path);
    if(!writeInfos.open(QIODevice::Append | QIODevice::Text))
        return;

    QTextStream out(&writeInfos);

    for (int i = 0; i < m_model->invisibleRootItem()->rowCount(); i++){
        out << "<script type=\"text/javascript\" src=\"Content/Datas/Scripts/"
            << m_model->item(i)->text()
            << ".js\"></script>\n";
    }

    writeInfos.close();
}

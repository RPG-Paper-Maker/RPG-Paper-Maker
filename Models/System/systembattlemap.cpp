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

#include "systembattlemap.h"
#include "dialogselectposition.h"

const QString SystemBattleMap::jsonIdMap = "idm";
const QString SystemBattleMap::jsonPosition = "p";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemBattleMap::SystemBattleMap()
{

}

SystemBattleMap::SystemBattleMap(int i, QString name) :
    SuperListItem(i, name)
{

}

SystemBattleMap::~SystemBattleMap(){

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemBattleMap::openDialog(){
    SystemBattleMap battleMap;
    battleMap.setCopy(*this);

    DialogSelectPosition dialog(battleMap.m_idMap, battleMap.m_position.x(),
        battleMap.m_position.y(), battleMap.m_position.yPlus(), battleMap
        .m_position.z());
    if (dialog.exec() == QDialog::Accepted){
        m_idMap = dialog.idMap();
        p_name = dialog.mapName();
        m_position.setCoords(dialog.x(), dialog.y(), dialog.yPlus(),dialog.z());
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemBattleMap::createCopy() const{
    SystemBattleMap* super = new SystemBattleMap;
    super->setCopy(*this);
    return super;
}


// -------------------------------------------------------

void SystemBattleMap::setCopy(const SystemBattleMap& battleMap){
    SuperListItem::setCopy(battleMap);

    m_idMap = battleMap.m_idMap;
    m_position.setCoords(battleMap.m_position.x(), battleMap.m_position.y(),
        battleMap.m_position.yPlus(), battleMap.m_position.z());
}

// -------------------------------------------------------

QList<QStandardItem *> SystemBattleMap::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    QStandardItem* itemId = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setText(toString());
    itemId->setText(QString::number(m_idMap));
    row.append(item);
    row.append(itemId);

    return row;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemBattleMap::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_idMap = json[jsonIdMap].toInt();
    m_position.read(json[jsonPosition].toArray());
}

// -------------------------------------------------------

void SystemBattleMap::write(QJsonObject &json) const{
    SuperListItem::write(json);
    QJsonArray objTab;

    json[jsonIdMap] = m_idMap;
    m_position.write(objTab);
    json[jsonPosition] = objTab;
}

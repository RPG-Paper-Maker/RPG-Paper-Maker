/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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
    SystemBattleMap(i, name, 1, Position3D(0, 0, 0, 0))
{

}

SystemBattleMap::SystemBattleMap(int i, QString name, int idMap,
    Position3D position) : SuperListItem(i, name), m_idMap(idMap), m_position(
    position)
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

QString SystemBattleMap::toString() const {
    return SuperListItem::toString() + " " + m_position.toString();
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

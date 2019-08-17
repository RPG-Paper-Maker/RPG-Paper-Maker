/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systembattlemap.h"
#include "dialogsystembattlemap.h"
#include "rpm.h"

const QString SystemBattleMap::JSON_CAMERA_PROPERTIES_ID = "cpi";
const QString SystemBattleMap::JSON_ID_MAP = "idm";
const QString SystemBattleMap::JSON_POSITION = "p";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemBattleMap::SystemBattleMap() :
    SystemBattleMap(-1, "")
{

}

SystemBattleMap::SystemBattleMap(int i, QString name, PrimitiveValue *cpi, int
    im, Position3D p) :
    SuperListItem(i, name),
    m_cameraPropertiesID(cpi),
    m_idMap(im),
    m_position(p)
{
    m_cameraPropertiesID->setModelDataBase(RPM::get()->project()->gameDatas()
        ->systemDatas()->modelcameraProperties());
}

SystemBattleMap::~SystemBattleMap() {
    delete m_cameraPropertiesID;
}

PrimitiveValue * SystemBattleMap::cameraPropertiesID() const {
    return m_cameraPropertiesID;
}

int SystemBattleMap::idMap() const {
    return m_idMap;
}

void SystemBattleMap::setIDMap(int id) {
    m_idMap = id;
}

Position3D SystemBattleMap::position() const {
    return m_position;
}

void SystemBattleMap::setPosition(Position3D &position) {
    m_position = position;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool SystemBattleMap::openDialog() {
    SystemBattleMap battleMap;
    battleMap.setCopy(*this);

    DialogSystemBattleMap dialog(battleMap);
    if (dialog.exec() == QDialog::Accepted) {
        this->setCopy(battleMap);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemBattleMap::createCopy() const {
    SystemBattleMap *super = new SystemBattleMap;
    super->setCopy(*this);
    return super;
}


// -------------------------------------------------------

void SystemBattleMap::setCopy(const SuperListItem &super) {
    const SystemBattleMap *battleMap;

    SuperListItem::setCopy(super);

    battleMap = reinterpret_cast<const SystemBattleMap *>(&super);
    m_cameraPropertiesID->setCopy(*battleMap->m_cameraPropertiesID);
    m_idMap = battleMap->m_idMap;
    m_position.setCopy(battleMap->m_position);
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

    if (json.contains(JSON_CAMERA_PROPERTIES_ID)) {
        m_cameraPropertiesID->read(json[JSON_CAMERA_PROPERTIES_ID].toObject());
    }
    m_idMap = json[JSON_ID_MAP].toInt();
    m_position.read(json[JSON_POSITION].toArray());
}

// -------------------------------------------------------

void SystemBattleMap::write(QJsonObject &json) const{
    SuperListItem::write(json);
    QJsonObject obj;
    QJsonArray tab;

    if (!m_cameraPropertiesID->isDefaultDataBaseValue()) {
        obj = QJsonObject();
        m_cameraPropertiesID->write(obj);
        json[JSON_CAMERA_PROPERTIES_ID] = obj;
    }
    json[JSON_ID_MAP] = m_idMap;
    m_position.write(tab);
    json[JSON_POSITION] = tab;
}

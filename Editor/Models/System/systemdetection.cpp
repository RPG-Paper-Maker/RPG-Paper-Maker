/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemdetection.h"
#include "rpm.h"
#include "dialogsystemdetection.h"
#include "object3dbox.h"

const QString SystemDetection::JSON_FIELD_LEFT = "fl";
const QString SystemDetection::JSON_FIELD_RIGHT = "fr";
const QString SystemDetection::JSON_FIELD_TOP = "ft";
const QString SystemDetection::JSON_FIELD_BOT = "fb";
const QString SystemDetection::JSON_BOXES = "b";
const QString SystemDetection::JSON_BOXES_HEIGHT_SQUARES = "bhs";
const QString SystemDetection::JSON_BOXES_HEIGHT_PIXELS = "bhp";
const int SystemDetection::DEFAULT_FIELD_LEFT = 2;
const int SystemDetection::DEFAULT_FIELD_RIGHT = 2;
const int SystemDetection::DEFAULT_FIELD_TOP = 2;
const int SystemDetection::DEFAULT_FIELD_BOT = 2;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemDetection::SystemDetection() :
    SystemDetection(-1, "")
{

}

SystemDetection::SystemDetection(int i, QString n, int fl, int fr, int ft, int
    fb) :
    SuperListItem (i, n),
    m_fieldLeft(fl),
    m_fieldRight(fr),
    m_fieldTop(ft),
    m_fieldBot(fb)
{

}

SystemDetection::~SystemDetection() {
    for (QHash<Position3D, SystemObject3D *>::iterator it = m_boxes.begin(); it
         != m_boxes.end(); it++)
    {
        delete *it;
    }
}

int SystemDetection::fieldLeft() const {
    return m_fieldLeft;
}

void SystemDetection::setFieldLeft(int f) {
    m_fieldLeft = f;
}

int SystemDetection::fieldRight() const {
    return m_fieldRight;
}

void SystemDetection::setFieldRight(int f) {
    m_fieldRight = f;
}

int SystemDetection::fieldTop() const {
    return m_fieldTop;
}

void SystemDetection::setFieldTop(int f) {
    m_fieldTop = f;
}

int SystemDetection::fieldBot() const {
    return m_fieldBot;
}

void SystemDetection::setFieldBot(int f) {
    m_fieldBot = f;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

Map * SystemDetection::createDetectionMap() {
    Map *map;
    MapProperties *mapProperties;

    mapProperties = new MapProperties(1, new LangsTranslation(""), 1 +
        m_fieldLeft + m_fieldRight, 1 + m_fieldTop + m_fieldBot, 1000, 1000, 1);
    map = new Map(mapProperties, this);

    return map;
}

// -------------------------------------------------------

void SystemDetection::getTargetPosition(QVector3D *position) const {
    position->setX((m_fieldLeft * RPM::getSquareSize()) + (RPM::getSquareSize()
        / 2));
    position->setZ((m_fieldTop * RPM::getSquareSize()) + (RPM::getSquareSize()
        / 2));
}

// -------------------------------------------------------

SystemObject3D * SystemDetection::instanciateObject() const {
    return new SystemObject3D(1, "", ShapeKind::Box, -1, -1, -2);
}

// -------------------------------------------------------

void SystemDetection::setDefault() {
    Position3D position;

    position.setZ(1);
    m_boxes.insert(position, this->instanciateObject());
}

// -------------------------------------------------------

void SystemDetection::initializeObjects(Objects3D *objects3D, Portion
    &globalPortion)
{
    QHash<Position3D, SystemObject3D *>::iterator it;
    QSet<Portion> portionsOverflow;
    Object3DDatas *object;
    Position position;

    for (it = m_boxes.begin(); it != m_boxes.end(); it++) {
        position = Position(it.key());
        position.setX(position.x() + m_fieldLeft);
        position.setZ(position.z() + m_fieldTop);
        if (Map::isInGlobalPortion(position, globalPortion)) {
            object = new Object3DBoxDatas(it.value());
            objects3D->setObject3D(portionsOverflow, position, object);
        }
    }
}

// -------------------------------------------------------

void SystemDetection::addObject(Position3D &position, SystemObject3D *object) {
    SystemObject3D *previousObject;
    Position3D newPosition;

    this->correctPosition(newPosition, position);
    previousObject = m_boxes.value(newPosition);
    if (previousObject != nullptr) {
        delete previousObject;
    }
    m_boxes.insert(newPosition, object);
}

// -------------------------------------------------------

void SystemDetection::deleteObject(Position3D &position) {
    SystemObject3D *object;
    Position3D newPosition;

    this->correctPosition(newPosition, position);
    object = m_boxes.value(newPosition);
    if (object != nullptr) {
        delete object;
    }
    m_boxes.remove(newPosition);
}

// -------------------------------------------------------

void SystemDetection::correctPosition(Position3D &newPosition, Position3D
    &position)
{
    newPosition.setX(position.x() - m_fieldLeft);
    newPosition.setY(position.y());
    newPosition.setYPlus(position.yPlus());
    newPosition.setZ(position.z() - m_fieldTop);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemDetection::openDialog() {
    SystemDetection detection;
    detection.setCopy(*this);
    DialogSystemDetection dialog(detection);

    if (dialog.exec() == QDialog::Accepted) {
        setCopy(detection);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem * SystemDetection::createCopy() const {
    SystemDetection *super = new SystemDetection;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemDetection::setCopy(const SuperListItem &super) {
    const SystemDetection *detection;
    QHash<Position3D, SystemObject3D *>::const_iterator it;
    SystemObject3D *object;

    SuperListItem::setCopy(super);

    detection = reinterpret_cast<const SystemDetection *>(&super);
    m_fieldLeft = detection->m_fieldLeft;
    m_fieldRight = detection->m_fieldRight;
    m_fieldTop = detection->m_fieldTop;
    m_fieldBot = detection->m_fieldBot;
    m_boxes.clear();
    for (it = detection->m_boxes.begin(); it != detection->m_boxes.end(); it++)
    {
        object = new SystemObject3D;
        object->setCopy(*it.value());
        m_boxes.insert(it.key(), object);
    }
}

// -------------------------------------------------------

void SystemDetection::read(const QJsonObject &json) {
    QJsonArray tab;
    QJsonObject obj;
    Position3D position;
    SystemObject3D *object;
    int i, l;

    SuperListItem::read(json);

    if (json.contains(JSON_FIELD_LEFT)) {
        m_fieldLeft = json[JSON_FIELD_LEFT].toInt();
    }
    if (json.contains(JSON_FIELD_RIGHT)) {
        m_fieldRight = json[JSON_FIELD_RIGHT].toInt();
    }
    if (json.contains(JSON_FIELD_TOP)) {
        m_fieldTop = json[JSON_FIELD_TOP].toInt();
    }
    if (json.contains(JSON_FIELD_BOT)) {
        m_fieldBot = json[JSON_FIELD_BOT].toInt();
    }
    tab = json[JSON_BOXES].toArray();
    for (i = 0, l = tab.size(); i < l; i++) {
        obj = tab.at(i).toObject();
        position.read(obj[RPM::JSON_KEY].toArray());
        obj = obj[RPM::JSON_VALUE].toObject();
        object = new SystemObject3D(1, "", ShapeKind::Box, -1, -1, -2,
            ObjectCollisionKind::None, -1, 1.0, 1, 0, obj[
            JSON_BOXES_HEIGHT_SQUARES].toInt(), obj[JSON_BOXES_HEIGHT_PIXELS]
            .toInt());
        m_boxes.insert(position, object);
    }
}

// -------------------------------------------------------

void SystemDetection::write(QJsonObject &json) const {
    QHash<Position3D, SystemObject3D *>::const_iterator it;
    SystemObject3D *object;
    QJsonArray tab, tabPosition;
    QJsonObject obj, objHash;

    SuperListItem::write(json);

    if (m_fieldLeft != DEFAULT_FIELD_LEFT) {
        json[JSON_FIELD_LEFT] = m_fieldLeft;
    }
    if (m_fieldRight != DEFAULT_FIELD_RIGHT) {
        json[JSON_FIELD_RIGHT] = m_fieldRight;
    }
    if (m_fieldTop != DEFAULT_FIELD_TOP) {
        json[JSON_FIELD_TOP] = m_fieldTop;
    }
    if (m_fieldBot != DEFAULT_FIELD_BOT) {
        json[JSON_FIELD_BOT] = m_fieldBot;
    }
    if (!m_boxes.isEmpty()) {
        for (it = m_boxes.begin(); it!= m_boxes.end(); it++) {
            tabPosition = QJsonArray();
            it.key().write(tabPosition);
            obj = QJsonObject();
            object = it.value();
            obj[JSON_BOXES_HEIGHT_SQUARES] = object->heightSquare();
            obj[JSON_BOXES_HEIGHT_PIXELS] = object->heightPixel();
            objHash = QJsonObject();
            objHash[RPM::JSON_KEY] = tabPosition;
            objHash[RPM::JSON_VALUE] = obj;
            tab.append(objHash);
        }
        json[JSON_BOXES] = tab;
    }
}

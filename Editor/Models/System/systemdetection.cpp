/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

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
const int SystemDetection::DEFAULT_CAMERA_DISTANCE = 400;
const int SystemDetection::DEFAULT_CAMERA_HORIZONTAL_ANGLE = -125;

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
    m_fieldBot(fb),
    m_currentHeightSquares(1),
    m_currentHeightPixels(0.0)
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

void SystemDetection::setCurrentHeightSquares(int v) {
    m_currentHeightSquares = v;
}

void SystemDetection::setCurrentHeightPixels(double v) {
    m_currentHeightPixels = v;
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
    position->setX(m_fieldLeft * RPM::getSquareSize());
    position->setZ(m_fieldTop * RPM::getSquareSize());
}

// -------------------------------------------------------

SystemObject3D * SystemDetection::instanciateObject() const {
    return new SystemObject3D(1, "", ShapeKind::Box, -1, -1, -2,
        ObjectCollisionKind::None, -1, 1.0, 1, 0, m_currentHeightSquares,
        m_currentHeightPixels, 1, 0, true);
}

// -------------------------------------------------------

void SystemDetection::setSelf() {
    Position3D position;

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

void SystemDetection::removeLimitDetections() {
    QHash<Position3D, SystemObject3D *>::iterator it;
    QList<Position3D> removeList;
    Position position;
    int i, l;

    for (it = m_boxes.begin(); it != m_boxes.end(); it++) {
        position = Position(it.key());
        if (position.x() < -m_fieldLeft || position.x() > m_fieldRight ||
            position.z() < -m_fieldTop || position.z() > m_fieldBot)
        {
            removeList.append(position);
            delete *it;
        }
    }
    for (i = 0, l = removeList.size(); i < l; i++) {
        m_boxes.remove(removeList.at(i));
    }
}

// -------------------------------------------------------

void SystemDetection::generateCircle(int radius, Position3D &origin) {
    SystemObject3D *object;
    Position position;
    int x, z;

    for (z = -radius; z <= radius; z++) {
        for (x = -radius; x <= radius; x++) {
            if ((x * x) + (z * z) <= radius * radius) {
                position.setX(origin.x() + x);
                position.setY(origin.y());
                position.setYPlus(origin.yPlus());
                position.setZ(origin.z() + z);
                object = this->instanciateObject();
                this->addObject(position, object);
            }
        }
    }
}

// -------------------------------------------------------

void SystemDetection::generateRectangle(int length, int width, Position3D
    &origin)
{
    SystemObject3D *object;
    Position position;
    int x, z;

    for (z = -width; z <= width; z++) {
        for (x = -length; x <= length; x++) {
            position.setX(origin.x() + x);
            position.setY(origin.y());
            position.setYPlus(origin.yPlus());
            position.setZ(origin.z() + z);
            object = this->instanciateObject();
            this->addObject(position, object);
        }
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemDetection::setDefault() {
    Position3D position;

    position.setZ(1);
    m_boxes.insert(position, this->instanciateObject());
}

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
    for (it = m_boxes.begin(); it != m_boxes.end(); it++) {
        delete *it;
    }
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
            ObjectCollisionKind::None, -1, 1.0, 1, 0, obj.contains(
            JSON_BOXES_HEIGHT_SQUARES) ? obj[JSON_BOXES_HEIGHT_SQUARES].toInt()
            : 1, obj.contains(JSON_BOXES_HEIGHT_PIXELS) ? obj[
            JSON_BOXES_HEIGHT_PIXELS].toDouble() : 0, 1, 0, true);
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
            if (object->heightSquare() != 1) {
                obj[JSON_BOXES_HEIGHT_SQUARES] = object->heightSquare();
            }
            if (object->heightP() != 0.0) {
                obj[JSON_BOXES_HEIGHT_PIXELS] = object->heightP();
            }
            objHash = QJsonObject();
            objHash[RPM::JSON_KEY] = tabPosition;
            objHash[RPM::JSON_VALUE] = obj;
            tab.append(objHash);
        }
        json[JSON_BOXES] = tab;
    }
}

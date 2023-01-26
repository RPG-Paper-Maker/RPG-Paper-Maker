/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

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
const QString SystemDetection::JSON_BOXES_LENGTH_SQUARES = "bls";
const QString SystemDetection::JSON_BOXES_LENGTH_PIXELS = "blp";
const QString SystemDetection::JSON_BOXES_WIDTH_SQUARES = "bws";
const QString SystemDetection::JSON_BOXES_WIDTH_PIXELS = "bwp";
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
    m_currentLengthSquares(1),
    m_currentLengthPixels(0.0),
    m_currentWidthSquares(1),
    m_currentWidthPixels(0.0),
    m_currentHeightSquares(1),
    m_currentHeightPixels(0.0),
    m_currentPreviewObject(nullptr)
{

}

SystemDetection::~SystemDetection() {
    for (QHash<Position, SystemObject3D *>::iterator it = m_boxes.begin(); it
         != m_boxes.end(); it++)
    {
        delete *it;
    }
    if (m_currentPreviewObject != nullptr)
    {
        delete m_currentPreviewObject;
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

void SystemDetection::setCurrentLengthSquares(int v)
{
    m_currentLengthSquares = v;
}

void SystemDetection::setCurrentLengthPixels(double v)
{
    m_currentLengthPixels = v;
}

void SystemDetection::setCurrentWidthSquares(int v)
{
    m_currentWidthSquares = v;
}

void SystemDetection::setCurrentWidthPixels(double v)
{
    m_currentWidthPixels = v;
}

void SystemDetection::setCurrentHeightSquares(int v)
{
    m_currentHeightSquares = v;
}

void SystemDetection::setCurrentHeightPixels(double v)
{
    m_currentHeightPixels = v;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

Map * SystemDetection::createDetectionMap()
{
    return new Map(new MapProperties(1, "", 1 + m_fieldLeft +  m_fieldRight, 1 +
        m_fieldTop + m_fieldBot, 1000, 1000, 1), this);
}

// -------------------------------------------------------

void SystemDetection::getTargetPosition(QVector3D *position) const
{
    position->setX(m_fieldLeft * RPM::getSquareSize());
    position->setZ(m_fieldTop * RPM::getSquareSize());
}

// -------------------------------------------------------

SystemObject3D * SystemDetection::instanciateObject() const
{
    return new SystemObject3D(1, "", ShapeKind::Box, -1, -1, -2,
        ObjectCollisionKind::None, -1, 1.0, m_currentLengthSquares,
        m_currentLengthPixels, m_currentHeightSquares, m_currentHeightPixels,
        m_currentWidthSquares, m_currentWidthPixels, true);
}

// -------------------------------------------------------

void SystemDetection::setFront() {
    Position position(0, 0, 0, 1, 0, 87.5, 50.0, 0);
    m_boxes.insert(position, new SystemObject3D(1, "", ShapeKind::Box, -1, -1, -2,
        ObjectCollisionKind::None, -1, 1.0, 0, 25, 0, 25, 0, 25, true));
}

// -------------------------------------------------------

void SystemDetection::setSelf() {
    Position position;
    m_boxes.insert(position, this->instanciateObject());
}

// -------------------------------------------------------

void SystemDetection::initializeObjects(Objects3D *objects3D, Portion
    &globalPortion)
{
    QHash<Position, SystemObject3D *>::iterator it;
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

void SystemDetection::addObject(Position &position, SystemObject3D *object) {
    SystemObject3D *previousObject;
    Position newPosition;
    this->correctPosition(newPosition, position);
    previousObject = m_boxes.value(newPosition);
    if (previousObject != nullptr) {
        delete previousObject;
    }
    m_boxes.insert(newPosition, object);
}

// -------------------------------------------------------

void SystemDetection::deleteObject(Position &position) {
    SystemObject3D *object;
    Position newPosition;

    this->correctPosition(newPosition, position);
    object = m_boxes.value(newPosition);
    if (object != nullptr) {
        delete object;
    }
    m_boxes.remove(newPosition);
}

// -------------------------------------------------------

void SystemDetection::correctPosition(Position &newPosition, Position &position)
{
    newPosition.setX(position.x() - m_fieldLeft);
    newPosition.setY(position.y());
    newPosition.setYPlus(position.yPlus());
    newPosition.setZ(position.z() - m_fieldTop);
    newPosition.setCenterX(position.centerX());
    newPosition.setCenterZ(position.centerZ());
}

// -------------------------------------------------------

void SystemDetection::removeLimitDetections() {
    QHash<Position, SystemObject3D *>::iterator it;
    QList<Position> removeList;
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

void SystemDetection::generateCircle(int radius, Position &origin) {
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

void SystemDetection::generateRectangle(int length, int width, Position &origin)
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

void SystemDetection::clearPreview(Objects3D *objects3D)
{
    QSet<Portion> portionsOverflow;
    QJsonObject prev;
    MapEditorSubSelectionKind kind = MapEditorSubSelectionKind::Object3D;
    Position newPosition;
    this->correctPosition(newPosition, m_currentPreviewPosition);
    SystemObject3D *object = m_boxes.value(newPosition);
    if (object == nullptr)
    {
        objects3D->deleteObject3D(portionsOverflow, m_currentPreviewPosition, prev, kind);
        if (m_currentPreviewObject != nullptr)
        {
            delete m_currentPreviewObject;
            m_currentPreviewObject = nullptr;
        }
    } else
    {
        objects3D->addObject3D(portionsOverflow, m_currentPreviewPosition, new
            Object3DBoxDatas(object), prev, kind);
    }
}

// -------------------------------------------------------

void SystemDetection::updatePreview(Objects3D *objects3D, Position &position)
{
    QSet<Portion> portionsOverflow;
    QJsonObject prev;
    MapEditorSubSelectionKind kind = MapEditorSubSelectionKind::Object3D;
    m_currentPreviewPosition = position;
    if (m_currentPreviewObject != nullptr)
    {
        delete m_currentPreviewObject;
    }
    m_currentPreviewObject = this->instanciateObject();
    objects3D->addObject3D(portionsOverflow, m_currentPreviewPosition, new
        Object3DBoxDatas(m_currentPreviewObject), prev, kind);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void SystemDetection::setDefault() {
    Position position;
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
    QHash<Position, SystemObject3D *>::const_iterator it;
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
    Position position;
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
            ObjectCollisionKind::None, -1, 1.0, obj.contains(JSON_BOXES_LENGTH_SQUARES) ?
            obj[JSON_BOXES_LENGTH_SQUARES].toInt() : 1, obj.contains(
            JSON_BOXES_LENGTH_PIXELS) ? obj[JSON_BOXES_LENGTH_PIXELS].toDouble() :
            0, obj.contains(JSON_BOXES_HEIGHT_SQUARES) ? obj[JSON_BOXES_HEIGHT_SQUARES]
            .toInt() : 1, obj.contains(JSON_BOXES_HEIGHT_PIXELS) ? obj[
            JSON_BOXES_HEIGHT_PIXELS].toDouble() : 0, obj.contains(
            JSON_BOXES_WIDTH_SQUARES) ? obj[JSON_BOXES_WIDTH_SQUARES].toInt() :
            1, obj.contains(JSON_BOXES_WIDTH_PIXELS) ? obj[JSON_BOXES_WIDTH_PIXELS]
            .toDouble() : 0, true);
        m_boxes.insert(position, object);
    }
}

// -------------------------------------------------------

void SystemDetection::write(QJsonObject &json) const {
    QHash<Position, SystemObject3D *>::const_iterator it;
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
            if (object->widthSquare() != 1) {
                obj[JSON_BOXES_LENGTH_SQUARES] = object->widthSquare();
            }
            if (object->widthP() != 0.0) {
                obj[JSON_BOXES_LENGTH_PIXELS] = object->widthP();
            }
            if (object->depthSquare() != 1) {
                obj[JSON_BOXES_WIDTH_SQUARES] = object->depthSquare();
            }
            if (object->depthP() != 0.0) {
                obj[JSON_BOXES_WIDTH_PIXELS] = object->depthP();
            }
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

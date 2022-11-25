/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcameraproperties.h"
#include "dialogsystemcameraproperties.h"

const QString SystemCameraProperties::JSON_DISTANCE = "d";
const QString SystemCameraProperties::JSON_HORIZONTAL_ANGLE = "ha";
const QString SystemCameraProperties::JSON_VERTICAL_ANGLE = "va";
const QString SystemCameraProperties::JSON_TARGET_OFFSET_X = "tox";
const QString SystemCameraProperties::JSON_TARGET_OFFSET_Y = "toy";
const QString SystemCameraProperties::JSON_TARGET_OFFSET_Z = "toz";
const QString SystemCameraProperties::JSON_IS_SQUARE_TARGET_OFFSET_X = "istox";
const QString SystemCameraProperties::JSON_IS_SQUARE_TARGET_OFFSET_Y = "istoy";
const QString SystemCameraProperties::JSON_IS_SQUARE_TARGET_OFFSET_Z = "istoz";
const QString SystemCameraProperties::JSON_FIELD_OF_VIEW = "fov";
const QString SystemCameraProperties::JSON_NEAR = "n";
const QString SystemCameraProperties::JSON_FAR = "f";
const QString SystemCameraProperties::JSON_ORTHOGRAPHIC = "o";
const double SystemCameraProperties::DEFAULT_DISTANCE = 300.0;
const double SystemCameraProperties::DEFAULT_HORIZONTAL_ANGLE = -90.0;
const double SystemCameraProperties::DEFAULT_VERTICAL_ANGLE = 65.0;
const int SystemCameraProperties::DEFAULT_TARGET_OFFSET_X = 0;
const int SystemCameraProperties::DEFAULT_TARGET_OFFSET_Y = 0;
const int SystemCameraProperties::DEFAULT_TARGET_OFFSET_Z = 0;
const bool SystemCameraProperties::DEFAULT_IS_SQUARE_TARGET_OFFSET_X = true;
const bool SystemCameraProperties::DEFAULT_IS_SQUARE_TARGET_OFFSET_Y = true;
const bool SystemCameraProperties::DEFAULT_IS_SQUARE_TARGET_OFFSET_Z = true;
const double SystemCameraProperties::DEFAULT_FIELD_OF_VIEW = 45.0;
const double SystemCameraProperties::DEFAULT_NEAR = 1.0;
const double SystemCameraProperties::DEFAULT_FAR = 100000.0;
const bool SystemCameraProperties::DEFAULT_ORTHOGRAPHIC = false;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCameraProperties::SystemCameraProperties() :
    SystemCameraProperties(1, "")
{

}

SystemCameraProperties::SystemCameraProperties(int i, QString n, PrimitiveValue
    *d, PrimitiveValue *ha, PrimitiveValue *va, PrimitiveValue *tox,
    PrimitiveValue *toy, PrimitiveValue *toz, bool istox, bool istoy, bool istoz
    , PrimitiveValue *fov, PrimitiveValue *ne, PrimitiveValue *f, bool orthographic) :
    SuperListItem(i, n),
    m_distance(d),
    m_horizontalAngle(ha),
    m_verticalAngle(va),
    m_targetOffsetX(tox),
    m_targetOffsetY(toy),
    m_targetOffsetZ(toz),
    m_isSquareTargetOffsetX(istox),
    m_isSquareTargetOffsetY(istoy),
    m_isSquareTargetOffsetZ(istoz),
    m_fieldOfView(fov),
    m_near(ne),
    m_far(f),
    m_orthographic(orthographic)
{

}

SystemCameraProperties::~SystemCameraProperties() {
    delete m_distance;
    delete m_horizontalAngle;
    delete m_verticalAngle;
    delete m_targetOffsetX;
    delete m_targetOffsetY;
    delete m_targetOffsetZ;
    delete m_fieldOfView;
    delete m_near;
    delete m_far;
}

PrimitiveValue * SystemCameraProperties::distance() const {
    return m_distance;
}

PrimitiveValue * SystemCameraProperties::horizontalAngle() const {
    return m_horizontalAngle;
}

PrimitiveValue * SystemCameraProperties::verticalAngle() const {
    return m_verticalAngle;
}

PrimitiveValue * SystemCameraProperties::targetOffsetX() const {
    return m_targetOffsetX;
}

PrimitiveValue * SystemCameraProperties::targetOffsetY() const {
    return m_targetOffsetY;
}

PrimitiveValue * SystemCameraProperties::targetOffsetZ() const {
    return m_targetOffsetZ;
}

PrimitiveValue * SystemCameraProperties::fieldOfView() const {
    return m_fieldOfView;
}

PrimitiveValue * SystemCameraProperties::nearCam() const {
    return m_near;
}

PrimitiveValue * SystemCameraProperties::farCam() const {
    return m_far;
}

bool SystemCameraProperties::isSquareTargetOffsetX() const
{
    return m_isSquareTargetOffsetX;
}

void SystemCameraProperties::setIsSquareTargetOffsetX(bool istox)
{
    m_isSquareTargetOffsetX = istox;
}

bool SystemCameraProperties::isSquareTargetOffsetY() const
{
    return m_isSquareTargetOffsetY;
}

void SystemCameraProperties::setIsSquareTargetOffsetY(bool istoy)
{
    m_isSquareTargetOffsetY = istoy;
}

bool SystemCameraProperties::isSquareTargetOffsetZ() const
{
    return m_isSquareTargetOffsetZ;
}

void SystemCameraProperties::setIsSquareTargetOffsetZ(bool istoz)
{
    m_isSquareTargetOffsetZ = istoz;
}

bool SystemCameraProperties::orthographic() const {
    return m_orthographic;
}

void SystemCameraProperties::setOrthographic(bool orthographic)
{
    m_orthographic = orthographic;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

bool SystemCameraProperties::openDialog() {
    SystemCameraProperties cameraProperties;
    cameraProperties.setCopy(*this);
    DialogSystemCameraProperties dialog(cameraProperties);

    if (dialog.exec() == QDialog::Accepted) {
        setCopy(cameraProperties);
        return true;
    }

    return false;
}

// -------------------------------------------------------

SuperListItem * SystemCameraProperties::createCopy() const {
    SystemCameraProperties *super = new SystemCameraProperties;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCameraProperties::setCopy(const SuperListItem &super) {
    const SystemCameraProperties *cameraProperties;

    SuperListItem::setCopy(super);

    cameraProperties = reinterpret_cast<const SystemCameraProperties *>(&super);
    m_distance->setCopy(*cameraProperties->m_distance);
    m_horizontalAngle->setCopy(*cameraProperties->m_horizontalAngle);
    m_verticalAngle->setCopy(*cameraProperties->m_verticalAngle);
    m_targetOffsetX->setCopy(*cameraProperties->m_targetOffsetX);
    m_targetOffsetY->setCopy(*cameraProperties->m_targetOffsetY);
    m_targetOffsetZ->setCopy(*cameraProperties->m_targetOffsetZ);
    m_isSquareTargetOffsetX = cameraProperties->m_isSquareTargetOffsetX;
    m_isSquareTargetOffsetY = cameraProperties->m_isSquareTargetOffsetY;
    m_isSquareTargetOffsetZ = cameraProperties->m_isSquareTargetOffsetZ;
    m_fieldOfView->setCopy(*cameraProperties->m_fieldOfView);
    m_near->setCopy(*cameraProperties->m_near);
    m_far->setCopy(*cameraProperties->m_far);
    m_orthographic = cameraProperties->m_orthographic;
}

// -------------------------------------------------------

void SystemCameraProperties::read(const QJsonObject &json) {
    SuperListItem::read(json);

    if (json.contains(JSON_DISTANCE)) {
        m_distance->read(json[JSON_DISTANCE].toObject());
    }
    if (json.contains(JSON_HORIZONTAL_ANGLE)) {
        m_horizontalAngle->read(json[JSON_HORIZONTAL_ANGLE].toObject());
    }
    if (json.contains(JSON_VERTICAL_ANGLE)) {
        m_verticalAngle->read(json[JSON_VERTICAL_ANGLE].toObject());
    }
    if (json.contains(JSON_TARGET_OFFSET_X)) {
        m_targetOffsetX->read(json[JSON_TARGET_OFFSET_X].toObject());
    }
    if (json.contains(JSON_TARGET_OFFSET_Y)) {
        m_targetOffsetY->read(json[JSON_TARGET_OFFSET_Y].toObject());
    }
    if (json.contains(JSON_TARGET_OFFSET_Z)) {
        m_targetOffsetZ->read(json[JSON_TARGET_OFFSET_Z].toObject());
    }
    if (json.contains(JSON_IS_SQUARE_TARGET_OFFSET_X)) {
        m_isSquareTargetOffsetX = json[JSON_TARGET_OFFSET_X].toBool();
    }
    if (json.contains(JSON_IS_SQUARE_TARGET_OFFSET_Y)) {
        m_isSquareTargetOffsetY = json[JSON_TARGET_OFFSET_Y].toBool();
    }
    if (json.contains(JSON_IS_SQUARE_TARGET_OFFSET_Z)) {
        m_isSquareTargetOffsetZ = json[JSON_TARGET_OFFSET_Z].toBool();
    }
    if (json.contains(JSON_FIELD_OF_VIEW)) {
        m_fieldOfView->read(json[JSON_FIELD_OF_VIEW].toObject());
    }
    if (json.contains(JSON_NEAR)) {
        m_near->read(json[JSON_NEAR].toObject());
    }
    if (json.contains(JSON_FAR)) {
        m_far->read(json[JSON_FAR].toObject());
    }
    if (json.contains(JSON_ORTHOGRAPHIC)) {
        m_orthographic = json[JSON_ORTHOGRAPHIC].toBool();
    }
}

// -------------------------------------------------------

void SystemCameraProperties::write(QJsonObject &json) const {
    QJsonObject obj;

    SuperListItem::write(json);

    if (m_distance->kind() != PrimitiveValueKind::NumberDouble || !qFuzzyCompare
        (m_distance->numberDoubleValue(), DEFAULT_DISTANCE))
    {
        obj = QJsonObject();
        m_distance->write(obj);
        json[JSON_DISTANCE] = obj;
    }
    if (m_horizontalAngle->kind() != PrimitiveValueKind::NumberDouble ||
        !qFuzzyCompare(m_horizontalAngle->numberDoubleValue(),
        DEFAULT_HORIZONTAL_ANGLE))
    {
        obj = QJsonObject();
        m_horizontalAngle->write(obj);
        json[JSON_HORIZONTAL_ANGLE] = obj;
    }
    if (m_verticalAngle->kind() != PrimitiveValueKind::NumberDouble ||
        !qFuzzyCompare(m_verticalAngle->numberDoubleValue(),
        DEFAULT_VERTICAL_ANGLE))
    {
        obj = QJsonObject();
        m_verticalAngle->write(obj);
        json[JSON_VERTICAL_ANGLE] = obj;
    }
    if (m_targetOffsetX->kind() != PrimitiveValueKind::Number || m_targetOffsetX
        ->numberValue() != DEFAULT_TARGET_OFFSET_X)
    {
        obj = QJsonObject();
        m_targetOffsetX->write(obj);
        json[JSON_TARGET_OFFSET_X] = obj;
    }
    if (m_targetOffsetY->kind() != PrimitiveValueKind::Number || m_targetOffsetY
        ->numberValue() != DEFAULT_TARGET_OFFSET_Y)
    {
        obj = QJsonObject();
        m_targetOffsetY->write(obj);
        json[JSON_TARGET_OFFSET_Y] = obj;
    }
    if (m_targetOffsetZ->kind() != PrimitiveValueKind::Number || m_targetOffsetZ
        ->numberValue() != DEFAULT_TARGET_OFFSET_Z)
    {
        obj = QJsonObject();
        m_targetOffsetZ->write(obj);
        json[JSON_TARGET_OFFSET_Z] = obj;
    }
    if (m_isSquareTargetOffsetX != DEFAULT_IS_SQUARE_TARGET_OFFSET_X)
    {
        json[JSON_IS_SQUARE_TARGET_OFFSET_X] = m_isSquareTargetOffsetX;
    }
    if (m_isSquareTargetOffsetY != DEFAULT_IS_SQUARE_TARGET_OFFSET_Y)
    {
        json[JSON_IS_SQUARE_TARGET_OFFSET_Y] = m_isSquareTargetOffsetY;
    }
    if (m_isSquareTargetOffsetZ != DEFAULT_IS_SQUARE_TARGET_OFFSET_Z)
    {
        json[JSON_IS_SQUARE_TARGET_OFFSET_Z] = m_isSquareTargetOffsetZ;
    }
    if (m_fieldOfView->kind() != PrimitiveValueKind::NumberDouble ||
        !qFuzzyCompare(m_fieldOfView->numberDoubleValue(), DEFAULT_FIELD_OF_VIEW))
    {
        obj = QJsonObject();
        m_fieldOfView->write(obj);
        json[JSON_FIELD_OF_VIEW] = obj;
    }
    if (m_near->kind() != PrimitiveValueKind::NumberDouble || !qFuzzyCompare(
        m_near->numberDoubleValue(), DEFAULT_NEAR))
    {
        obj = QJsonObject();
        m_near->write(obj);
        json[JSON_NEAR] = obj;
    }
    if (m_far->kind() != PrimitiveValueKind::NumberDouble || !qFuzzyCompare(
        m_far->numberDoubleValue(), DEFAULT_FAR))
    {
        obj = QJsonObject();
        m_far->write(obj);
        json[JSON_FAR] = obj;
    }
    if (m_orthographic != DEFAULT_ORTHOGRAPHIC) {
        json[JSON_ORTHOGRAPHIC] = m_orthographic;
    }
}

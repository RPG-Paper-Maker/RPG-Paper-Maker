/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemspecialelement.h"
#include "rpm.h"

const QString SystemSpecialElement::JSON_SHAPE_KIND = "sk";
const QString SystemSpecialElement::JSON_OBJ_ID = "oid";
const QString SystemSpecialElement::JSON_MTL_ID = "mid";
const QString SystemSpecialElement::JSON_PIC_ID = "pic";
const QString SystemSpecialElement::JSON_COLLISION_KIND = "ck";
const QString SystemSpecialElement::JSON_COLLISION_CUSTOM_ID = "ccid";
const QString SystemSpecialElement::JSON_SCALE = "s";
const QString SystemSpecialElement::JSON_WIDTH_SQUARE = "ws";
const QString SystemSpecialElement::JSON_WIDTH_PIXEL = "wp";
const QString SystemSpecialElement::JSON_HEIGHT_SQUARE = "hs";
const QString SystemSpecialElement::JSON_HEIGHT_PIXEL = "hp";
const QString SystemSpecialElement::JSON_DEPTH_SQUARE = "ds";
const QString SystemSpecialElement::JSON_DEPTH_PIXEL = "dp";
const QString SystemSpecialElement::JSON_STRETCH = "st";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemSpecialElement::SystemSpecialElement() :
    SystemSpecialElement(1, "")
{

}

SystemSpecialElement::SystemSpecialElement(int i, QString n, ShapeKind shapeKind
    , int objID, int mtlID, int pictureID, ObjectCollisionKind collisionKind,
    int collisionCustomID, double scale, int wS, double wP, int hS, double hP,
    int dS, double dP, bool stretch) :
    SuperListItem(i, n),
    m_shapeKind(shapeKind),
    m_objID(new SuperListItem(objID)),
    m_mtlID(new SuperListItem(mtlID)),
    m_pictureID(pictureID),
    m_collisionKind(collisionKind),
    m_collisionCustomID(new SuperListItem(collisionCustomID)),
    m_scale(scale),
    m_widthSquare(wS),
    m_widthPixel(wP),
    m_heightSquare(hS),
    m_heightPixel(hP),
    m_depthSquare(dS),
    m_depthPixel(dP),
    m_stretch(stretch)
{
    updateObjName();
    updateMtlName();
    updateCustomCollisionName();
}

SystemSpecialElement::~SystemSpecialElement()
{
    delete m_objID;
    delete m_mtlID;
    delete m_collisionCustomID;
}

ShapeKind SystemSpecialElement::shapeKind() const {
    return m_shapeKind;
}

void SystemSpecialElement::setShapeKind(ShapeKind shape) {
    m_shapeKind = shape;
}

SystemCustomShape * SystemSpecialElement::obj() const {
    return reinterpret_cast<SystemCustomShape *>(SuperListItem::getById(RPM
        ::get()->project()->shapesDatas()->model(CustomShapeKind::OBJ)
        ->invisibleRootItem(), m_objID->id()));
}

SuperListItem * SystemSpecialElement::objID() const {
    return m_objID;
}

SuperListItem * SystemSpecialElement::mtlID() const {
    return m_mtlID;
}

int SystemSpecialElement::pictureID() const {
    return m_pictureID;
}

void SystemSpecialElement::setPictureID(int id) {
    m_pictureID = id;
}

ObjectCollisionKind SystemSpecialElement::collisionKind() const {
    return m_collisionKind;
}

void SystemSpecialElement::setCollisionKind(ObjectCollisionKind collisionKind) {
    m_collisionKind = collisionKind;
}

SuperListItem * SystemSpecialElement::collisionCustomID() const {
    return m_collisionCustomID;
}

double SystemSpecialElement::scale() const {
    return m_scale;
}

void SystemSpecialElement::setScale(double scale) {
    m_scale = scale;
}

int SystemSpecialElement:: width() const {
    return (m_widthSquare * RPM::get()->getSquareSize()) + this->widthPixel();
}

int SystemSpecialElement:: widthSquare() const {
    return m_widthSquare;
}

void SystemSpecialElement::setWidthSquare(int ws) {
    m_widthSquare = ws;
}

int SystemSpecialElement::widthPixel() const {
    return static_cast<int>(m_widthPixel * RPM::get()->getSquareSize() / 100);
}

void SystemSpecialElement::setWidthPixel(int wp) {
    m_widthPixel = static_cast<double>(wp) / RPM::get()->getSquareSize() * 100;
}

int SystemSpecialElement:: height() const {
    return (m_heightSquare * RPM::get()->getSquareSize()) + this->heightPixel();
}

int SystemSpecialElement::heightSquare() const {
    return m_heightSquare;
}

void SystemSpecialElement::setHeightSquare(int hs) {
    m_heightSquare = hs;
}

int SystemSpecialElement::heightPixel() const {
    return static_cast<int>(m_heightPixel * RPM::get()->getSquareSize() / 100);
}

void SystemSpecialElement::setHeightPixel(int hp) {
    m_heightPixel = static_cast<double>(hp) / RPM::get()->getSquareSize() * 100;
}

int SystemSpecialElement::depth() const {
    return (m_depthSquare * RPM::get()->getSquareSize()) + this->depthPixel();
}

int SystemSpecialElement::depthSquare() const {
    return m_depthSquare;
}

void SystemSpecialElement::setDepthSquare(int ds) {
    m_depthSquare = ds;
}

int SystemSpecialElement::depthPixel() const {
    return static_cast<int>(m_depthPixel * RPM::get()->getSquareSize() / 100);
}

void SystemSpecialElement::setDepthPixel(int dp) {
    m_depthPixel = static_cast<double>(dp) / RPM::get()->getSquareSize() * 100;
}

bool SystemSpecialElement::stretch() const {
    return m_stretch;
}

void SystemSpecialElement::setStretch(bool s) {
    m_stretch = s;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemSpecialElement::updateObjName() {
    this->updateGenericObjectName(m_objID, CustomShapeKind::OBJ);
}

// -------------------------------------------------------

void SystemSpecialElement::updateMtlName() {
    this->updateGenericObjectName(m_mtlID, CustomShapeKind::MTL);
}

// -------------------------------------------------------

void SystemSpecialElement::updateCustomCollisionName() {
    this->updateGenericObjectName(m_collisionCustomID, CustomShapeKind
        ::Collisions);
}

// -------------------------------------------------------

void SystemSpecialElement::updateGenericObjectName(SuperListItem *obj,
    CustomShapeKind kind)
{
    SuperListItem *super;

    super = SuperListItem::getById(RPM::get()->project()->shapesDatas()->model(
        kind)->invisibleRootItem(), obj->id());
    if (super != nullptr) {
        obj->setName(super->name());
    }
}

// -------------------------------------------------------

SystemPicture* SystemSpecialElement::pictureByKind(PictureKind kind) const {
    return reinterpret_cast<SystemPicture *>(SuperListItem::getById(RPM::get()
        ->project()->picturesDatas()->model(kind)->invisibleRootItem(),
        m_pictureID));
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SystemPicture * SystemSpecialElement::picture() const {
    return nullptr;
}

// -------------------------------------------------------

SuperListItem* SystemSpecialElement::createCopy() const{
    SystemSpecialElement* super = new SystemSpecialElement;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemSpecialElement::setCopy(const SystemSpecialElement& super) {
    SuperListItem::setCopy(super);

    m_shapeKind = super.m_shapeKind;
    m_objID->setId(super.m_objID->id());
    m_objID->setName(super.m_objID->name());
    m_mtlID->setId(super.m_mtlID->id());
    m_mtlID->setName(super.m_mtlID->name());
    m_pictureID = super.m_pictureID;
    m_collisionKind = super.m_collisionKind;
    m_collisionCustomID->setId(super.m_collisionCustomID->id());
    m_collisionCustomID->setName(super.m_collisionCustomID->name());
    m_scale = super.m_scale;
    m_widthSquare = super.m_widthSquare;
    m_widthPixel = super.m_widthPixel;
    m_heightSquare = super.m_heightSquare;
    m_heightPixel = super.m_heightPixel;
    m_depthSquare = super.m_depthSquare;
    m_depthPixel = super.m_depthPixel;
    m_stretch = super.m_stretch;
}

// -------------------------------------------------------

void SystemSpecialElement::read(const QJsonObject &json){
    SuperListItem::read(json);

    if (json.contains(JSON_SHAPE_KIND)) {
        m_shapeKind = static_cast<ShapeKind>(json[JSON_SHAPE_KIND].toInt());
    }
    if (json.contains(JSON_OBJ_ID)) {
        m_objID->setId(json[JSON_OBJ_ID].toInt());
        updateObjName();
    }
    if (json.contains(JSON_MTL_ID)) {
        m_mtlID->setId(json[JSON_MTL_ID].toInt());
        updateMtlName();
    }
    if (json.contains(JSON_PIC_ID)) {
        m_pictureID = json[JSON_PIC_ID].toInt();
    }
    if (json.contains(JSON_COLLISION_KIND)) {
        m_collisionKind = static_cast<ObjectCollisionKind>(json[
            JSON_COLLISION_KIND].toInt());
    }
    if (json.contains(JSON_COLLISION_CUSTOM_ID)) {
        m_collisionCustomID->setId(json[JSON_COLLISION_CUSTOM_ID].toInt());
        updateCustomCollisionName();
    }
    if (json.contains(JSON_SCALE)) {
        m_scale = json[JSON_SCALE].toDouble();
    }
    if (json.contains(JSON_WIDTH_SQUARE)) {
        m_widthSquare = json[JSON_WIDTH_SQUARE].toInt();
    }
    if (json.contains(JSON_WIDTH_PIXEL)) {
        m_widthPixel = json[JSON_WIDTH_PIXEL].toDouble();
    }
    if (json.contains(JSON_HEIGHT_SQUARE)) {
        m_heightSquare = json[JSON_HEIGHT_SQUARE].toInt();
    }
    if (json.contains(JSON_HEIGHT_PIXEL)) {
        m_heightPixel = json[JSON_HEIGHT_PIXEL].toDouble();
    }
    if (json.contains(JSON_DEPTH_SQUARE)) {
        m_depthSquare = json[JSON_DEPTH_SQUARE].toInt();
    }
    if (json.contains(JSON_DEPTH_PIXEL)) {
        m_depthPixel = json[JSON_DEPTH_PIXEL].toDouble();
    }
    if (json.contains(JSON_STRETCH)) {
        m_stretch = json[JSON_STRETCH].toBool();
    }
}

// -------------------------------------------------------

void SystemSpecialElement::write(QJsonObject &json) const{
    SuperListItem::write(json);

    if (m_shapeKind != ShapeKind::Box) {
        json[JSON_SHAPE_KIND] = static_cast<int>(m_shapeKind);
    }
    if (m_shapeKind == ShapeKind::Custom) {
        if (m_objID->id() != -1) {
            json[JSON_OBJ_ID] = m_objID->id();
        }
        if (m_mtlID->id() != -1) {
            json[JSON_MTL_ID] = m_mtlID->id();
        }
    }
    if (m_pictureID != -1) {
        json[JSON_PIC_ID] = m_pictureID;
    }
    if (m_collisionKind != ObjectCollisionKind::None) {
        json[JSON_COLLISION_KIND] = static_cast<int>(m_collisionKind);
        if (m_collisionKind == ObjectCollisionKind::Custom) {
            if (m_collisionCustomID->id() != -1) {
                json[JSON_COLLISION_CUSTOM_ID] = m_collisionCustomID->id();
            }
        }
    }
    if (m_shapeKind == ShapeKind::Custom) {
        if (m_scale != 1.0) {
            json[JSON_SCALE] = m_scale;
        }
    }
    if (m_shapeKind == ShapeKind::Box) {
        if (m_widthSquare != 1) {
            json[JSON_WIDTH_SQUARE] = m_widthSquare;
        }
        if (m_widthPixel != 0.0) {
            json[JSON_WIDTH_PIXEL] = m_widthPixel;
        }
        if (m_heightSquare != 1) {
            json[JSON_HEIGHT_SQUARE] = m_heightSquare;
        }
        if (m_heightPixel != 0.0) {
            json[JSON_HEIGHT_PIXEL] = m_heightPixel;
        }
        if (m_depthSquare != 1) {
            json[JSON_DEPTH_SQUARE] = m_depthSquare;
        }
        if (m_depthPixel != 0.0) {
            json[JSON_DEPTH_PIXEL] = m_depthPixel;
        }
        if (m_stretch) {
            json[JSON_STRETCH] = m_stretch;
        }
    }
}

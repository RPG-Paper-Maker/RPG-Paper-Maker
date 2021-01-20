/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "object3dbox.h"
#include "object3dcustom.h"
#include "rpm.h"

const QString Object3DDatas::JSON_DATAS_ID = "did";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Object3DDatas::Object3DDatas() :
    Object3DDatas(nullptr)
{

}

Object3DDatas::Object3DDatas(SystemObject3D *datas) :
    m_datas(datas)
{

}

Object3DDatas::~Object3DDatas()
{

}

SystemObject3D * Object3DDatas::datas() const {
    return m_datas;
}

int Object3DDatas::textureID() const {
    return m_datas->pictureID();
}

bool Object3DDatas::operator==(const Object3DDatas& other) const {
    return MapElement::operator==(other) && m_datas->id()== other.m_datas->id();
}

bool Object3DDatas::operator!=(const Object3DDatas& other) const {
    return !operator==(other);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

Object3DDatas * Object3DDatas::instanciate(SystemObject3D *datas) {
    switch (datas->shapeKind()) {
    case ShapeKind::Box:
        return new Object3DBoxDatas(datas);
    case ShapeKind::Custom:
        return new Object3DCustomDatas(datas);
    default:
        return nullptr;
    }
}

// -------------------------------------------------------

Object3DDatas * Object3DDatas::instanciateFromJSON(const QJsonObject &json) {
    return Object3DDatas::instanciate(Object3DDatas::readFromJSON(json));
}

// -------------------------------------------------------

SystemObject3D * Object3DDatas::readFromJSON(const QJsonObject &json) {
    SystemObject3D *object;
    int id;

    id = json[JSON_DATAS_ID].toInt();
    object = reinterpret_cast<SystemObject3D *>(SuperListItem::getById(RPM
        ::get()->project()->specialElementsDatas()->model(PictureKind::Object3D)
        ->invisibleRootItem(), id, false));
    if (object == nullptr) {
        object = RPM::get()->project()->specialElementsDatas()
            ->missingObject3D();
        object->setId(id);
    }

    return object;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

MapEditorSelectionKind Object3DDatas::getKind() const {
    return MapEditorSelectionKind::Objects3D;
}

// -------------------------------------------------------

MapEditorSubSelectionKind Object3DDatas::getSubKind() const {
    return MapEditorSubSelectionKind::Object3D;
}

// -------------------------------------------------------

QString Object3DDatas::toString() const {
    return RPM::translate(Translations::THREED_OBJECT).toUpper() + RPM::SPACE +
        RPM::DASH + RPM::SPACE + m_datas->name();
}

// -------------------------------------------------------

void Object3DDatas::read(const QJsonObject &json) {
    MapElement::read(json);

    m_datas = Object3DDatas::readFromJSON(json);
}

// -------------------------------------------------------

void Object3DDatas::write(QJsonObject &json) const{
    MapElement::write(json);

    json[JSON_DATAS_ID] = m_datas->id();
}

// -------------------------------------------------------
//
//
//  ---------- Object3DObject
//
//
// -------------------------------------------------------

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Object3DObject::Object3DObject(Object3DDatas &datas) :
    m_datas(datas),
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_program(nullptr)
{

}

Object3DObject::~Object3DObject()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Object3DObject::initializeVertices(Position &position)
{
    m_vertices.clear();
    m_indexes.clear();
    unsigned int count = 0;
    switch (m_datas.datas()->shapeKind())
    {
    case ShapeKind::Box:
        reinterpret_cast<Object3DBoxDatas &>(m_datas).initializeVertices(
            m_vertices, m_indexes, position, count);
        break;
    case ShapeKind::Custom:
        reinterpret_cast<Object3DCustomDatas &>(m_datas).initializeVertices(
            m_vertices, m_indexes, position, count);
        break;
    default:
        break;
    }
}

// -------------------------------------------------------
//
//  GL
//
// -------------------------------------------------------

void Object3DObject::initializeGL(QOpenGLShaderProgram *programStatic)
{
    if (m_program == nullptr){
        initializeOpenGLFunctions();
        m_program = programStatic;
    }
}

// -------------------------------------------------------

void Object3DObject::updateGL(){
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes,
        m_vao, m_program);
}

// -------------------------------------------------------

void Object3DObject::paintGL(){
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, nullptr);
    m_vao.release();
}

/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcustomshape.h"
#include "rpm.h"
#include "common.h"

const QString SystemCustomShape::PARSE_VERTEX = "v ";
const QString SystemCustomShape::PARSE_NORMAL = "vn ";
const QString SystemCustomShape::PARSE_TEXTURE = "vt ";
const QString SystemCustomShape::PARSE_FACE = "f ";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCustomShape::SystemCustomShape() :
    SystemCustomShape(-1, "<" + RPM::translate(Translations::NONE) + ">", false)
{

}

SystemCustomShape::SystemCustomShape(int i, QString n, bool isBR, QString dlc,
    CustomShapeKind kind) :
    SystemResource(i, n, isBR, dlc),
    m_kind(kind),
    m_loaded(false)
{

}

SystemCustomShape::~SystemCustomShape() {

}

void SystemCustomShape::setKind(CustomShapeKind kind)
{
    m_kind = kind;
}

QVector3D SystemCustomShape::getVertexAt(int i) const {
    return m_vertices.at(i);
}

QVector2D SystemCustomShape::getTextureAt(int i) const {
    return m_textures.value(i);
}

QPair<int, int> SystemCustomShape::getFace(int i) const {
    return m_faces.at(i);
}

int SystemCustomShape::facesCount() const {
    return m_faces.size();
}

QVector3D SystemCustomShape::minVertex() const {
    return m_minVertex;
}

QVector3D SystemCustomShape::maxVertex() const {
    return m_maxVertex;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemCustomShape * SystemCustomShape::getByID(int id, CustomShapeKind kind) {
    return reinterpret_cast<SystemCustomShape *>(SuperListItem::getById(RPM::get()
        ->project()->shapesDatas()->model(kind)->invisibleRootItem(), id));
}

// -------------------------------------------------------

QString SystemCustomShape::getFolder(CustomShapeKind kind, bool isBR, QString
    dlc)
{
    return Common::pathCombine(SystemResource::getFolder(isBR, dlc),
        SystemCustomShape::getLocalFolder(kind));
}

// -------------------------------------------------------

QString SystemCustomShape::getLocalFolder(CustomShapeKind kind) {
    switch (kind) {
    case CustomShapeKind::OBJ:
        return RPM::PATH_OBJ;
    case CustomShapeKind::MTL:
        return RPM::PATH_MTL;
    case CustomShapeKind::Collisions:
        return RPM::PATH_COLLISIONS;
    default:
        return "";
    }
}

// -------------------------------------------------------

QString SystemCustomShape::getShapeTitle(CustomShapeKind kind) {
    switch(kind) {
    case CustomShapeKind::OBJ:
        return "OBJ";
    case CustomShapeKind::MTL:
        return "MTL";
    case CustomShapeKind::Collisions:
        return RPM::translate(Translations::COLLISIONS);
    default:
        return "";
    }
}

// -------------------------------------------------------

QString SystemCustomShape::getShapeExtension(CustomShapeKind kind) {
    switch(kind) {
    case CustomShapeKind::OBJ:
    case CustomShapeKind::Collisions:
        return ".obj";
    case CustomShapeKind::MTL:
        return ".mtl";
    default:
        return "";
    }
}

// -------------------------------------------------------

QString SystemCustomShape::getShapeExtensionBrowse(CustomShapeKind kind) {
    switch(kind) {
    case CustomShapeKind::OBJ:
        return "OBJ (*.obj)";
    case CustomShapeKind::MTL:
        return "MTL (*.mtl)";
    default:
        return "";
    }
}

// -------------------------------------------------------

QString SystemCustomShape::getPath() const {
    if (id() == -1)
        return "";

    QString folder = getFolder(m_kind, m_isBR, m_dlc);

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------

QString SystemCustomShape::getLocalPath() const {
    QString folder = getLocalFolder(m_kind);

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------

void SystemCustomShape::loadCustomObj() {
    if (m_kind != CustomShapeKind::OBJ) {
        return;
    }

    QVector3D temp3D;
    QVector2D temp2D;
    QStringList lineList, arg, arg1, arg2, arg3, arg4;
    QString fileLine, fileName;
    int i, l;
    bool firstVertex;

    // clear
    m_vertices.clear();
    m_textures.clear();
    m_faces.clear();

    // Parsing .obj file
    firstVertex = true;
    fileName = this->getPath();
    if (fileName.isEmpty()) {
        return;
    }
    QFile file(fileName);
    if (file.open(QIODevice::ReadOnly | QIODevice::Text)) {
        QTextStream fileText(&file);
        while (!fileText.atEnd()) {
            fileLine = fileText.readLine();
            if (fileLine.startsWith(PARSE_VERTEX)) {
                lineList = fileLine.split(" ");
                lineList.removeAll("");
                temp3D.setX(lineList[1].toFloat());
                temp3D.setY(lineList[2].toFloat());
                temp3D.setZ(lineList[3].toFloat());
                m_vertices.append(temp3D);

                // Determine min and max border for creating box collision
                if (firstVertex) {
                    m_minVertex = temp3D;
                    m_maxVertex = temp3D;
                    firstVertex = false;
                } else {
                    if (temp3D.x() < m_minVertex.x()) {
                        m_minVertex.setX(temp3D.x());
                    }
                    if (temp3D.y() < m_minVertex.y()) {
                        m_minVertex.setY(temp3D.y());
                    }
                    if (temp3D.z() < m_minVertex.z()) {
                        m_minVertex.setZ(temp3D.z());
                    }
                    if (temp3D.x() > m_maxVertex.x()) {
                        m_maxVertex.setX(temp3D.x());
                    }
                    if (temp3D.y() > m_maxVertex.y()) {
                        m_maxVertex.setY(temp3D.y());
                    }
                    if (temp3D.z() > m_maxVertex.z()) {
                        m_maxVertex.setZ(temp3D.z());
                    }
                }
            }
            else if (fileLine.startsWith(PARSE_TEXTURE)) {
                lineList = fileLine.split(" ");
                lineList.removeAll("");
                temp2D.setX(lineList[1].toFloat());
                temp2D.setY(1.0f - lineList[2].toFloat());
                m_textures.append(temp2D);
            }
            else if (fileLine.startsWith(PARSE_FACE)) {
                lineList = fileLine.split(" ");
                lineList.removeAll("");
                l = lineList.size() - 1;
                arg1 = lineList[1].split("/");
                for (i = 1; i < l - 1; i++)
                {
                    arg2 = lineList[1 + i].split("/");
                    arg3 = lineList[2 + i].split("/");
                    m_faces.append(QPair<int, int>(arg1[0].toInt() - 1, arg1[1]
                        .toInt() - 1));
                    m_faces.append(QPair<int, int>(arg2[0].toInt() - 1, arg2[1]
                        .toInt() - 1));
                    m_faces.append(QPair<int, int>(arg3[0].toInt() - 1, arg3[1]
                        .toInt() - 1));
                }
            }
        }
    }
    file.close();
    m_loaded = true;
}

// -------------------------------------------------------

SuperListItem* SystemCustomShape::createCopy() const {
    SystemCustomShape* super = new SystemCustomShape;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCustomShape::setCopy(const SuperListItem &super) {
    const SystemCustomShape *shape;

    SystemResource::setCopy(super);

    shape = reinterpret_cast<const SystemCustomShape *>(&super);
    m_kind = shape->m_kind;
}

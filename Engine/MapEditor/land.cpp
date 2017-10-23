#include "land.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

LandDatas::LandDatas()
{

}

LandDatas::~LandDatas()
{

}

MapEditorSubSelectionKind LandDatas::getSubKind() const{
    return MapEditorSubSelectionKind::None;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void LandDatas::initializeVertices(int, int, int, QVector<Vertex>&,
                                   QVector<GLuint>&, Position&, int&)
{

}

// -------------------------------------------------------

float LandDatas::intersection(int squareSize, QRay3D& ray, Position& position) {
    /*
    QVector3D pos, size, center;
    float minDistance = 0, distance = 0;
    QBox3D box;

    QVector3D vecA = Floor::verticesQuad[0] * size + pos,
              vecB = Floor::verticesQuad[1] * size + pos,
              vecC = Floor::verticesQuad[2] * size + pos,
              vecD = Floor::verticesQuad[3] * size + pos;
        box = QBox3D(vecA, vecC);
        minDistance = box.intersection(ray);*/

    return 0.0f;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void LandDatas::read(const QJsonObject &){

}

// -------------------------------------------------------

void LandDatas::write(QJsonObject &) const{

}

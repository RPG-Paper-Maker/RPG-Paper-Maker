/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "waypreview.h"
#include "lands.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WayPreview::WayPreview() :
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_program(nullptr)
{
    this->loadTexture();

}

WayPreview::~WayPreview()
{
    delete m_texture;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool WayPreview::checkTwoOrientations(OrientationKind kind1, OrientationKind kind2,
    OrientationKind possibleKind1, OrientationKind possibleKind2)
{
    return (kind1 == possibleKind1 && kind2 == possibleKind2) || (kind1 ==
        possibleKind2 && kind2 == possibleKind1);
}

// -------------------------------------------------------

void WayPreview::loadTexture() {
    m_texture = new QOpenGLTexture(QImage(":/textures/Ressources/arrow-preview.png"));
    m_texture->setMinificationFilter(QOpenGLTexture::Filter::Nearest);
    m_texture->setMagnificationFilter(QOpenGLTexture::Filter::Nearest);
}

// -------------------------------------------------------

void WayPreview::initializeVertices(Position3D &p, QList<OrientationKind> &orientations)
{
    this->clear();

    if (p.x() == -1 || orientations.isEmpty())
    {
        return;
    }
    OrientationKind currentOrientation = OrientationKind::South;
    OrientationKind previousOrientation = OrientationKind::South;
    Position newP = p;
    int count = 0;
    for (int i = 0, l = orientations.size(); i < l; i++)
    {
        currentOrientation = orientations.at(i);
        if (i == 0)
        {
            this->addSquareStart(newP, currentOrientation, count);
        } else
        {
            if (currentOrientation == previousOrientation || WayPreview
                ::checkTwoOrientations(currentOrientation, previousOrientation,
                OrientationKind::North, OrientationKind::South) || WayPreview
                ::checkTwoOrientations(currentOrientation, previousOrientation,
                OrientationKind::East, OrientationKind::West))
            {
                this->addSquareSide(newP, currentOrientation, count);
            } else {
                this->addSquareCornerOrientation(newP, currentOrientation,
                    previousOrientation, OrientationKind::South, OrientationKind
                    ::West, count);
                this->addSquareCornerOrientation(newP, currentOrientation,
                    previousOrientation, OrientationKind::North, OrientationKind
                    ::East, count);
                this->addSquareCornerOrientation(newP, currentOrientation,
                    previousOrientation, OrientationKind::West, OrientationKind
                    ::North, count);
                this->addSquareCornerOrientation(newP, currentOrientation,
                    previousOrientation, OrientationKind::East, OrientationKind
                    ::South, count);
            }
        }
        previousOrientation = currentOrientation;
        switch (currentOrientation)
        {
        case OrientationKind::South:
            newP.setZ(newP.z() + 1);
            break;
        case OrientationKind::West:
            newP.setX(newP.x() - 1);
            break;
        case OrientationKind::North:
            newP.setZ(newP.z() - 1);
            break;
        case OrientationKind::East:
            newP.setX(newP.x() + 1);
            break;
        default:
            break;
        }
    }
    this->addSquareEnd(newP, currentOrientation, count);
}

// -------------------------------------------------------

void WayPreview::addSquare(Position3D &p, OrientationKind orientation, float left,
    float right, int &count)
{
    QVector3D pos(p.x() * RPM::getSquareSize(), (p.y() * RPM::getSquareSize()) +
        (RPM::getSquareSize() / 2), p.z() * RPM::getSquareSize());
    QVector3D vecA = Lands::verticesQuad[0] * RPM::getSquareSize() + pos;
    QVector3D vecB = Lands::verticesQuad[1] * RPM::getSquareSize() + pos;
    QVector3D vecC = Lands::verticesQuad[2] * RPM::getSquareSize() + pos;
    QVector3D vecD = Lands::verticesQuad[3] * RPM::getSquareSize() + pos;

    float angle = 0;
    switch (orientation) {
    case OrientationKind::South:
        angle = 0;
        break;
    case OrientationKind::West:
        angle = -90;
        break;
    case OrientationKind::North:
        angle = -180;
        break;
    case OrientationKind::East:
        angle = -270;
        break;
    default:
        break;
    }
    QVector3D center = QVector3D(vecA.x() + (RPM::getSquareSize() / 2), vecA.y(),
        vecA.z() + (RPM::getSquareSize() / 2));
    SpriteDatas::rotateSpriteX(vecA, vecB, vecC, vecD, center, angle, 0, 1, 0);
    m_vertices.append(Vertex(vecA, QVector2D(left, 0.0f)));
    m_vertices.append(Vertex(vecB, QVector2D(right, 0.0f)));
    m_vertices.append(Vertex(vecC, QVector2D(right, 1.0f)));
    m_vertices.append(Vertex(vecD, QVector2D(left, 1.0f)));
    for (int i = 0; i < Lands::nbIndexesQuad; i++)
    {
        m_indexes.append(Lands::indexesQuad[i] + count);
    }
    count += 4;
}

// -------------------------------------------------------

void WayPreview::addSquareCorner(Position3D &p, OrientationKind orientation, int &count)
{
    this->addSquare(p, orientation, 0.0f, 0.25f, count);
}

// -------------------------------------------------------

void WayPreview::addSquareSide(Position3D &p, OrientationKind orientation, int &count)
{
    this->addSquare(p, orientation, 0.25f, 0.5f, count);
}

// -------------------------------------------------------

void WayPreview::addSquareStart(Position3D &p, OrientationKind orientation, int &count)
{
    this->addSquare(p, orientation, 0.5f, 0.75f, count);
}

// -------------------------------------------------------

void WayPreview::addSquareEnd(Position3D &p, OrientationKind orientation, int &count)
{
    this->addSquare(p, orientation, 0.75f, 1.0f, count);
}

// -------------------------------------------------------

void WayPreview::addSquareCornerOrientation(Position3D &p, OrientationKind currentOrientation,
    OrientationKind previousOrientation, OrientationKind orientation1,
    OrientationKind orientation2, int &count)
{
    if (currentOrientation == orientation1) {
        if (previousOrientation == orientation2) {
            this->addSquareCorner(p, orientation1, count);
        } else {
            this->addSquareCorner(p, orientation2, count);
        }
    }
}

// -------------------------------------------------------

void WayPreview::clear() {
    m_vertices.clear();
    m_indexes.clear();
}

// -------------------------------------------------------

void WayPreview::initializeGL(QOpenGLShaderProgram *programStatic){
    if (m_program == nullptr){
        initializeOpenGLFunctions();

        m_program = programStatic;
    }
}

// -------------------------------------------------------

void WayPreview::updateGL() {
    Map::updateGLStatic(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes,
        m_vao, m_program);
}

// -------------------------------------------------------

void WayPreview::paintGL() {
    m_program->bind();
    m_texture->bind();
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, 0);
    m_vao.release();
    m_texture->release();
    m_program->release();
}

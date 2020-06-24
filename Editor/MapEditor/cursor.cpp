/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "cursor.h"
#include <QtMath>
#include <QDateTime>
#include "rpm.h"
#include "floors.h"
#include "keyboardenginekind.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Cursor::Cursor(QVector3D* position) :
    m_positionSquare(position),
    m_positionReal(*position),
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_frameDuration(250),
    m_frameNumber(4)
{

}

Cursor::~Cursor()
{
    delete m_program;
    delete m_texture;
}

int Cursor::getSquareX() const{
    return static_cast<int>((m_positionSquare->x() + 1) / RPM::getSquareSize());
}

int Cursor::getSquareY() const{
    return qFloor(static_cast<qreal>(m_positionSquare->y()) / RPM::getSquareSize());
}

int Cursor::getYPlus() const {
   return Common::modulo(static_cast<int>(m_positionSquare->y()), RPM::getSquareSize());
}

double Cursor::getPercentYPlus() const {
    return static_cast<double>(getYPlus()) / RPM::getSquareSize() * 100;
}

int Cursor::getSquareZ() const{
    return static_cast<int>((m_positionSquare->z() + 1) / RPM::getSquareSize());
}

void Cursor::setX(int x, bool withReal){
    m_positionSquare->setX(x * RPM::getSquareSize());
    if (withReal)
        m_positionReal.setX(x * RPM::getSquareSize());
}

void Cursor::setY(Position3D pos, bool withReal) {
    int y = pos.getY(RPM::getSquareSize());

    m_positionSquare->setY(y);
    if (withReal)
        m_positionReal.setY(y);
}

void Cursor::setZ(int z, bool withReal){
    m_positionSquare->setZ(z * RPM::getSquareSize());
    if (withReal)
        m_positionReal.setZ(z * RPM::getSquareSize());
}

void Cursor::setPositions(Position3D& position){
    setX(position.x());
    setY(position);
    setZ(position.z());
}

float Cursor::getX() const { return m_positionSquare->x(); }

float Cursor::getY() const { return m_positionSquare->y(); }

float Cursor::getZ() const { return m_positionSquare->z(); }

void Cursor::setFrameDuration(int i) { m_frameDuration = i; }

void Cursor::setFrameNumber(int i) { m_frameNumber = i; }

QVector3D* Cursor::position() const { return m_positionSquare; }

void Cursor::getPosition3D(Position3D &position) const {
    if (m_positionSquare->x() < 0 || m_positionSquare->z() < 0) {
        position.setCoords(-1, 0, 0, -1);
    } else {
        position.setCoords(this->getSquareX(), this->getSquareY(), 0, this
            ->getSquareZ());
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

Portion Cursor::getPortion() const{
    int y = getSquareY();
    if (m_positionSquare->y() > RPM::getSquareSize()) {
        y--;
    }
    return Portion(getSquareX() / RPM::PORTION_SIZE, qFloor(static_cast<qreal>(y)
        / RPM::PORTION_SIZE), getSquareZ() / RPM::PORTION_SIZE);
}

// -------------------------------------------------------

void Cursor::loadTexture(QString path){
    m_texture = new QOpenGLTexture(QImage(path));
    m_texture->setMinificationFilter(QOpenGLTexture::Filter::Nearest);
    m_texture->setMagnificationFilter(QOpenGLTexture::Filter::Nearest);
}

// -------------------------------------------------------

void Cursor::updatePositionSquare() {
    setX(static_cast<int>(m_positionReal.x()) / RPM::getSquareSize(), false);
    //m_positionSquare->setY(static_cast<int>(m_positionReal.y() / RPM::getSquareSize()));
    setZ(static_cast<int>(m_positionReal.z()) / RPM::getSquareSize(), false);
}

// ------------------------------------------------------

void Cursor::centerInSquare(int offset) {
    m_positionReal.setX(((int)((m_positionReal.x()) / RPM::getSquareSize()) *
                        RPM::getSquareSize()) + (RPM::getSquareSize() / 2) - offset);
    m_positionReal.setZ(((int)((m_positionReal.z()) / RPM::getSquareSize()) *
                        RPM::getSquareSize()) + (RPM::getSquareSize() / 2) - 1);
}

// ------------------------------------------------------

void Cursor::onKeyPressed(int key, double angle, int w, int h, double speed){
    int xPlus, zPlus, res;
    KeyBoardDatas* keyBoardDatas = RPM::get()->engineSettings()
            ->keyBoardDatas();
    w *= RPM::getSquareSize();
    h *= RPM::getSquareSize();

    if (speed == -1)
        speed = RPM::getSquareSize();

    if (keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorUp)){
        xPlus = (int)(speed * (qRound(qCos(angle * M_PI / 180.0))));
        zPlus = (int)(speed * (qRound(qSin(angle * M_PI / 180.0))));
        res = m_positionReal.z() + zPlus;
        if (res >= 0 && res < h)
            m_positionReal.setZ(res);
        res = m_positionReal.x() + xPlus;
        if (res >= 0 && res < w)
            m_positionReal.setX(res);
    }
    else if (keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorDown)){
        xPlus = (int)(speed * (qRound(qCos(angle * M_PI / 180.0))));
        zPlus = (int)(speed * (qRound(qSin(angle * M_PI / 180.0))));
        res = m_positionReal.z() - zPlus;
        if (res >= 0 && res < h)
            m_positionReal.setZ(res);
        res = m_positionReal.x() - xPlus;
        if (res >= 0 && res < w)
            m_positionReal.setX(res);
    }
    else if (keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorLeft)){
        xPlus = (int)(speed *
                      (qRound(qCos((angle - 90) * M_PI / 180.0))));
        zPlus = (int)(speed *
                      (qRound(qSin((angle - 90) * M_PI / 180.0))));
        res = m_positionReal.x() + xPlus;
        if (res >= 0 && res < w)
            m_positionReal.setX(res);
        res = m_positionReal.z() + zPlus;
        if (res >= 0 && res < h)
            m_positionReal.setZ(res);
    }
    else if (keyBoardDatas->isEqual(key, KeyBoardEngineKind::MoveCursorRight)){
        xPlus = (int)(speed *
                      (qRound(qCos((angle - 90) * M_PI / 180.0))));
        zPlus = (int)(speed *
                      (qRound(qSin((angle - 90) * M_PI / 180.0))));
        res = m_positionReal.x() - xPlus;
        if (res >= 0 && res < w)
            m_positionReal.setX(res);
        res = m_positionReal.z() - zPlus;
        if (res >= 0 && res < h)
            m_positionReal.setZ(res);
    }
}

// -------------------------------------------------------

void Cursor::initialize(){
    initializeVertices();
    initializeGL();
}

// -------------------------------------------------------

void Cursor::addHeight(int h, int hp) {
    int y, yPlus, newY, maxD, maxH;

    maxD = RPM::get()->project()->currentMap()->mapProperties()->depth();
    maxH = RPM::get()->project()->currentMap()->mapProperties()->height() - 1;
    y = qFloor(static_cast<qreal>(m_positionReal.y()) / RPM::getSquareSize());
    yPlus = Common::modulo(qFloor(static_cast<qreal>(m_positionReal.y())),
        RPM::getSquareSize());

    if (y + h >= -maxD && y + h <= maxH && yPlus + hp >= 0 && yPlus + hp <
        RPM::getSquareSize())
    {
        newY = ((y + h) * RPM::getSquareSize()) + yPlus + hp;

        m_positionSquare->setY(newY);
        m_positionReal.setY(newY);
    }
}

// -------------------------------------------------------

void Cursor::initializeVertices(){

    QVector3D pos(0.0f, 0.15f, 0.0f);
    float w = 1.0f / m_frameNumber;
    float h = 1.0f;

    // Vertices
    m_vertices.clear();
    m_vertices.append(Vertex(Lands::verticesQuad[0] * RPM::getSquareSize() + pos,
                      QVector2D(0.0f, 0.0f)));
    m_vertices.append(Vertex(Lands::verticesQuad[1] * RPM::getSquareSize() + pos,
                      QVector2D(w, 0.0f)));
    m_vertices.append(Vertex(Lands::verticesQuad[2] * RPM::getSquareSize() + pos,
                      QVector2D(w, h)));
    m_vertices.append(Vertex(Lands::verticesQuad[3] * RPM::getSquareSize() + pos,
                      QVector2D(0.0f, h)));

    // indexes
    m_indexes.clear();
    for (int i = 0; i < Lands::nbIndexesQuad; i++)
        m_indexes.append(Lands::indexesQuad[i]);
}

// -------------------------------------------------------

void Cursor::initializeGL(){
    initializeOpenGLFunctions();

    // Create Shader
    m_program = Map::createProgram("cursor");

    // Uniform location of camera
    u_modelviewProjection = m_program->uniformLocation("modelviewProjection");
    u_cursorPosition = m_program->uniformLocation("cursorPosition");
    u_frameTex = m_program->uniformLocation("frameTex");

    // Create Buffer (Do not release until VAO is created)
    m_vertexBuffer.create();
    m_vertexBuffer.bind();
    m_vertexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    m_vertexBuffer.allocate(m_vertices.constData(), Lands::nbVerticesQuad *
                            sizeof(Vertex));

    m_indexBuffer.create();
    m_indexBuffer.bind();
    m_indexBuffer.setUsagePattern(QOpenGLBuffer::StaticDraw);
    m_indexBuffer.allocate(m_indexes.constData(), Lands::nbIndexesQuad *
                           sizeof(GLuint));

    // Create Vertex Array Object
    m_vao.create();
    m_vao.bind();
    m_program->enableAttributeArray(0);
    m_program->enableAttributeArray(1);
    m_program->setAttributeBuffer(0, GL_FLOAT, Vertex::positionOffset(),
                                        Vertex::positionTupleSize,
                                        Vertex::stride());
    m_program->setAttributeBuffer(1, GL_FLOAT, Vertex::texOffset(),
                                        Vertex::texCoupleSize,
                                        Vertex::stride());

    // Release
    m_vao.release();
    m_indexBuffer.release();
    m_vertexBuffer.release();
    m_program->release();
}

// -------------------------------------------------------

void Cursor::paintGL(QMatrix4x4 &modelviewProjection){

    // Calculating frame
    int totalTime = QTime::currentTime().msecsSinceStartOfDay() %
            (m_frameDuration * m_frameNumber);
    int frame = totalTime / m_frameDuration;

    m_program->bind();

    // Uniforms
    m_program->setUniformValue(u_modelviewProjection, modelviewProjection);
    m_program->setUniformValue(u_cursorPosition, *m_positionSquare);
    m_program->setUniformValue(u_frameTex, frame / (float)(m_frameNumber));

    // Draw
    {
      m_vao.bind();
      m_texture->bind();
      m_indexBuffer.bind();
      glDrawElements(GL_TRIANGLES, Lands::nbIndexesQuad, GL_UNSIGNED_INT, 0);
      m_indexBuffer.release();
      m_vao.release();
    }
    m_program->release();
}

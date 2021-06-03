/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "battler.h"
#include "sprite.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

Battler::Battler(QVector3D &position, int battlerID, bool reverse) :
    m_position(position),
    m_reverse(reverse),
    m_vertexBuffer(QOpenGLBuffer::VertexBuffer),
    m_indexBuffer(QOpenGLBuffer::IndexBuffer),
    m_program(nullptr)
{
    SystemPicture *picture = reinterpret_cast<SystemPicture *>(SuperListItem::getById(
        RPM::get()->project()->picturesDatas()->model(PictureKind::Battlers)
        ->invisibleRootItem(), battlerID, true));
    int id = picture->id();
    if (id != 0) {
        QImage image;
        QString path = picture->getPath();
        if (path.isEmpty()) {
            image.fill(QColor(0, 0, 0, 0));
        } else {
            image.load(path);
        }
        if (reverse)
        {
            image = image.mirrored(true, false);
        }
        m_texture = Map::createTexture(image);
    }
}

Battler::~Battler()
{
    delete m_texture;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void Battler::initializeVertices()
{
    m_vertices.clear();
    m_indexes.clear();
    QVector3D size(m_texture->width() / RPM::get()->project()->gameDatas()
        ->systemDatas()->battlersFrames(), m_texture->height() / RPM::get()
        ->project()->gameDatas()->systemDatas()->battlersColumns(), 1);
    float x = size.x() * (m_reverse ? 3 : 0) / m_texture->width();
    float y = 0;
    float w = size.x() / m_texture->width();
    float h = size.y() / m_texture->height();
    float coefX = 0.1 / m_texture->width();
    float coefY = 0.1 / m_texture->height();
    x += coefX;
    y += coefY;
    w -= (coefX * 2);
    h -= (coefY * 2);
    QVector2D texA(x, y), texB(x + w, y), texC(x + w, y + h), texD(x, y + h);
    QVector2D s(size.x(), size.y());

    // Vertices
    m_vertices.append(VertexBillboard(m_position, texA, s, Sprite::modelQuad[0]));
    m_vertices.append(VertexBillboard(m_position, texB, s, Sprite::modelQuad[1]));
    m_vertices.append(VertexBillboard(m_position, texC, s, Sprite::modelQuad[2]));
    m_vertices.append(VertexBillboard(m_position, texD, s, Sprite::modelQuad[3]));

    // indexes
    for (int i = 0; i < Sprite::nbIndexesQuad; i++)
    {
        m_indexes.append(Sprite::indexesQuad[i]);
    }
}

// -------------------------------------------------------

void Battler::initializeGL(QOpenGLShaderProgram *program)
{
    if (m_program == nullptr)
    {
        initializeOpenGLFunctions();
        m_program = program;
    }
}

// -------------------------------------------------------

void Battler::updateGL()
{
    Map::updateGLFace(m_vertexBuffer, m_indexBuffer, m_vertices, m_indexes, m_vao,
        m_program);
}

// -------------------------------------------------------

void Battler::paintGL()
{
    m_texture->bind();
    m_vao.bind();
    glDrawElements(GL_TRIANGLES, m_indexes.size(), GL_UNSIGNED_INT, nullptr);
    m_vao.release();
    m_texture->release();
}


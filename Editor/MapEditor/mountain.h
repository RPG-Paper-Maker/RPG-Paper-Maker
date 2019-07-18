/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef MOUNTAIN_H
#define MOUNTAIN_H

#include <qray3d.h>
#include <QOpenGLFunctions>
#include "mapelement.h"
#include "vertex.h"
#include "textureseveral.h"
#include "qbox3d.h"

// -------------------------------------------------------
//
//  CLASS MountainDatas
//
//  A 3D object datas.
//
// -------------------------------------------------------

class MountainDatas : public MapElement
{
public:
    const static QString JSON_SPECIAL_ID;
    const static QString JSON_WIDTH_SQUARES;
    const static QString JSON_WIDTH_PIXELS;
    const static QString JSON_HEIGHT_SQUARES;
    const static QString JSON_HEIGHT_PIXELS;
    const static QString JSON_TOP;
    const static QString JSON_BOT;
    const static QString JSON_LEFT;
    const static QString JSON_RIGHT;
    const static int X_LEFT_OFFSET;
    const static int X_MID_OFFSET;
    const static int X_RIGHT_OFFSET;
    const static int X_MIX_OFFSET;
    const static int Y_TOP_OFFSET;
    const static int Y_MID_OFFSET;
    const static int Y_BOT_OFFSET;
    const static int Y_MIX_OFFSET;

    MountainDatas();
    MountainDatas(int specialID, int ws, double wp, int hs, double hp);
    virtual ~MountainDatas();

    int specialID() const;
    int widthSquares() const;
    double widthPixels() const;
    int heightSquares() const;
    double heightPixels() const;

    bool operator==(const MountainDatas& other) const;
    bool operator!=(const MountainDatas& other) const;

    int width() const;
    int height(int yPlus) const;
    int widthOnlyPixelsPlus() const;
    int heightOnlyPixelsPlus() const;
    int widthTotalPixels() const;
    int heightTotalPixels() const;
    void drawEntireFaces(bool left, bool right, float angle, QVector3D &center,
        int width, int height, float w, float faceHeight, int wp, float xLeft,
        float xRight, float yTop, float yBot, float zFront, float zBack, float
        yOffset, QVector3D &vecFrontA, QVector3D &vecBackA, QVector3D
        &vecFrontB, QVector3D &vecBackB, QVector<Vertex> &vertices, QVector<
        GLuint> &indexes, int &count);
    void drawSideCorner(int xKind, int yKind, float angle, QVector3D &center,
        int width, int height, float w, float faceHeight, int wp, float xLeft,
        float xRight, float xLeftTop, float xRightTop, float xLeftBot, float
        xRightBot, float yTop, float yBot, float zFront, float zBack, float
        zFrontLeft, float zFrontRight, float zBackLeft, float zBackRight, float
        yOffset, QVector<Vertex> &vertices, QVector<GLuint> &indexes, int
        &count, float xCornerOffsetTop, float xCornerOffsetBot);
    void drawFace(int xKind, int yKind, float angle, QVector3D &center, int
        width, int height, float w, float faceHeight, float xLeftTop, float
        xRightTop, float xLeftBot, float xRightBot, float yTop, float yBot,
        float zFrontLeft, float zFrontRight, float zBackLeft, float zBackRight,
        float yOffset, QVector<Vertex> &vertices, QVector<GLuint> &indexes, int
        &count, float xCornerOffsetTop, float xCornerOffsetBot, bool isCorner);
    bool update(Position &position, Portion &portion, QHash<Position,
        MountainDatas *> &preview);

    virtual void initializeVertices(QVector<Vertex> &vertices, QVector<GLuint>
        &indexes, TextureSeveral *texture, Position &position, int &count);
    virtual float intersection(QRay3D& ray) const;
    virtual MapEditorSelectionKind getKind() const;
    virtual MapEditorSubSelectionKind getSubKind() const;
    virtual QString toString() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_specialID;
    int m_widthSquares;
    double m_widthPixels;
    int m_heightSquares;
    double m_heightPixels;
    bool m_top;
    bool m_bot;
    bool m_left;
    bool m_right;

    QBox3D m_box;
    QBox3D m_boxOverflow;
};

#endif // MOUNTAIN_H

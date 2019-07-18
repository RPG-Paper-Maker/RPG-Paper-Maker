/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QtMath>
#include "mountain.h"
#include "rpm.h"
#include "systemmountain.h"

const QString MountainDatas::JSON_SPECIAL_ID = "sid";
const QString MountainDatas::JSON_WIDTH_SQUARES = "ws";
const QString MountainDatas::JSON_WIDTH_PIXELS = "wp";
const QString MountainDatas::JSON_HEIGHT_SQUARES = "hs";
const QString MountainDatas::JSON_HEIGHT_PIXELS = "hp";
const QString MountainDatas::JSON_TOP = "t";
const QString MountainDatas::JSON_BOT = "b";
const QString MountainDatas::JSON_LEFT = "l";
const QString MountainDatas::JSON_RIGHT = "r";
const int MountainDatas::X_LEFT_OFFSET = 0;
const int MountainDatas::X_MID_OFFSET = 1;
const int MountainDatas::X_RIGHT_OFFSET = 2;
const int MountainDatas::X_MIX_OFFSET = 3;
const int MountainDatas::Y_TOP_OFFSET = 0;
const int MountainDatas::Y_MID_OFFSET = 1;
const int MountainDatas::Y_BOT_OFFSET = 2;
const int MountainDatas::Y_MIX_OFFSET = 3;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

MountainDatas::MountainDatas() :
    MountainDatas(-1, 0, 0, 1, 0)
{

}

MountainDatas::MountainDatas(int specialID, int ws, double wp, int hs, double
    hp) :
    m_specialID(specialID),
    m_widthSquares(ws),
    m_widthPixels(wp),
    m_heightSquares(hs),
    m_heightPixels(hp),
    m_top(false),
    m_bot(false),
    m_left(false),
    m_right(false)
{

}

MountainDatas::~MountainDatas()
{

}

int MountainDatas::specialID() const {
    return m_specialID;
}

int MountainDatas::widthSquares() const {
    return m_widthSquares;
}

double MountainDatas::widthPixels() const {
    return m_widthPixels;
}

int MountainDatas::heightSquares() const {
    return m_heightSquares;
}

double MountainDatas::heightPixels() const {
    return m_heightPixels;
}

bool MountainDatas::operator==(const MountainDatas& other) const {
    return MapElement::operator==(other) && m_specialID == other.m_specialID &&
        m_widthSquares == other.m_widthSquares && qFuzzyCompare(m_widthPixels,
        other.m_widthPixels) && m_heightSquares == other.m_heightSquares &&
        qFuzzyCompare(m_heightPixels, other.m_heightPixels);
}

bool MountainDatas::operator!=(const MountainDatas& other) const {
    return !operator==(other);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

int MountainDatas::width() const {
    return m_widthSquares + (this->widthOnlyPixelsPlus() > 0 ? 1 : 0);
}

// -------------------------------------------------------

int MountainDatas::height(int yPlus) const {
    return m_heightSquares + (this->heightOnlyPixelsPlus() + yPlus > 0 ? 1 : 0);
}

// -------------------------------------------------------

int MountainDatas::widthOnlyPixelsPlus() const {
    return static_cast<int>(m_widthPixels * RPM::get()->getSquareSize() / 100);
}

// -------------------------------------------------------

int MountainDatas::heightOnlyPixelsPlus() const {
    return static_cast<int>(m_heightPixels * RPM::get()->getSquareSize() / 100);
}

// -------------------------------------------------------

int MountainDatas::widthTotalPixels() const {
    return m_widthSquares * RPM::get()->getSquareSize() + this
        ->widthOnlyPixelsPlus();
}

// -------------------------------------------------------

int MountainDatas::heightTotalPixels() const {
    return m_heightSquares * RPM::get()->getSquareSize() + this
        ->heightOnlyPixelsPlus();
}

// -------------------------------------------------------

void MountainDatas::drawEntireFaces(bool left, bool right, float angle,
    QVector3D &center, int width, int height, float w, float faceHeight, int wp,
    float xLeft, float xRight, float yTop, float yBot, float zFront, float zBack
    , float yOffset, QVector3D &vecFrontA, QVector3D &vecBackA, QVector3D
    &vecFrontB, QVector3D &vecBackB, QVector<Vertex> &vertices, QVector<GLuint>
    &indexes, int &count)
{
    QVector3D vecStepLeftA, vecStepLeftB, vecStepRightA, vecStepRightB,
        vecCenterA, vecCenterB, vecCorner, vecCenterC;
    int i, xKind, squareSize;
    float nbSteps;

    squareSize = RPM::get()->getSquareSize();
    xKind = MountainDatas::X_LEFT_OFFSET;
    nbSteps = qCeil(static_cast<double>(faceHeight / squareSize));
    vecCenterA = vecFrontA + (0.5 * (vecBackA - vecFrontA));
    vecCenterB = vecFrontB + (0.5 * (vecBackB - vecFrontB));
    vecCenterC = vecCenterA + (0.5 * (vecCenterB - vecCenterA));

    // Define x offset according to left / right stuff
    if (!left && right) {
        xKind = MountainDatas::X_LEFT_OFFSET;
    } else if (left && right) {
        xKind = MountainDatas::X_MID_OFFSET;
    } else if (left && !right) {
        xKind = MountainDatas::X_RIGHT_OFFSET;
    } else if (!left && !right) {
        xKind = MountainDatas::X_MIX_OFFSET;
    }

    // Draw all faces
    if (qFuzzyCompare(faceHeight, squareSize)) { // 1 Mix sprite
        // Mix
        this->drawSideCorner(xKind, MountainDatas::Y_MIX_OFFSET, angle, center,
            width, height, w, faceHeight, wp, xLeft, xRight, vecBackA.x(),
            vecBackB.x(), vecFrontA.x(), vecBackB.x(), yTop, yBot, zFront, zBack
            , vecFrontA.z(), vecFrontB.z(), vecBackA.z(), vecBackB.z(), yOffset,
            vertices, indexes, count, 0, vecFrontA.distanceToPoint(vecFrontB));
    } else if (faceHeight <= (2 * squareSize)) { // 2 B / T sprites
        // Bottom
        vecCorner = vecCenterA;
        vecCenterC = vecFrontA;
        SpriteDatas::rotateVertexX(vecCorner, vecCenterC, 45, 0, 1, 0);
        this->drawSideCorner(xKind, MountainDatas::Y_BOT_OFFSET, angle, center,
            width, height, w, qFloor(static_cast<double>(faceHeight / 2)), wp,
            xLeft, xRight, vecCenterA.x(), vecCenterB.x(), vecFrontA.x(),
            vecFrontB.x(), vecCenterB.y(), yBot, zFront, vecCenterB.z(),
            vecFrontA.z(), vecFrontB.z(), vecCenterA.z(), vecCenterB.z(),
            yOffset, vertices, indexes, count, vecCenterA.distanceToPoint(
            vecCenterB), vecFrontA.distanceToPoint(vecFrontB));

        // Top
        this->drawSideCorner(xKind, MountainDatas::Y_TOP_OFFSET, angle, center,
            width, height, w, qCeil(static_cast<double>(faceHeight / 2)), wp,
            xLeft, xRight, vecBackA.x(), vecBackB.x(), vecCenterA.x(),
            vecCenterB.x(), yTop, vecCenterB.y(), vecCenterB.z(), zBack,
            vecCenterA.z(), vecCenterB.z(), vecBackA.z(), vecBackB.z(), yOffset,
            vertices, indexes, count, 0, vecCenterA.distanceToPoint(vecCenterB));
    }
    else { // 3 B / M / T sprites
        // Bottom
        vecStepLeftB = vecFrontA + ((1 / nbSteps) * (vecBackA - vecFrontA));
        vecStepRightB = vecFrontB + ((1 / nbSteps) * (vecBackB - vecFrontB));
        this->drawSideCorner(xKind, MountainDatas::Y_BOT_OFFSET, angle, center,
            width, height, w, qFloor(static_cast<double>(faceHeight / nbSteps)),
            wp, xLeft, xRight, vecStepLeftB.x(), vecStepRightB.x(), vecFrontA
            .x(), vecFrontB.x(), vecStepRightB.y(), yBot, zFront, vecStepRightB
            .z(), vecFrontA.z(), vecFrontB.z(), vecStepLeftB.z(), vecStepRightB
            .z(), yOffset, vertices, indexes, count, vecStepLeftB
            .distanceToPoint(vecStepRightB), vecFrontA.distanceToPoint(vecFrontB));

        // Middle: add as many as middle blocks as possible
        for (i = 2; i <= nbSteps - 1; i++) {
            vecStepLeftA = vecStepLeftB;
            vecStepRightA = vecStepRightB;
            vecStepLeftB = vecFrontA + ((i / nbSteps) * (vecBackA - vecFrontA));
            vecStepRightB = vecFrontB + ((i / nbSteps) * (vecBackB - vecFrontB));

            this->drawSideCorner(xKind, MountainDatas::Y_MID_OFFSET, angle,
                center, width, height, w, qFloor(static_cast<double>(faceHeight
                / nbSteps)), wp, xLeft, xRight, vecStepLeftB.x(), vecStepRightB
                .x(), vecStepLeftA.x(), vecStepRightA.x(), vecStepRightB.y(),
                vecStepRightA.y(), vecStepRightA.z(), vecStepRightB.z(),
                vecStepLeftA.z(), vecStepRightA.z(), vecStepLeftB.z(),
                vecStepRightB.z(), yOffset, vertices, indexes, count,
                vecStepLeftB.distanceToPoint(vecStepRightB), vecStepLeftA
                .distanceToPoint(vecStepRightA));
        }

        // Top
        this->drawSideCorner(xKind, MountainDatas::Y_TOP_OFFSET, angle, center,
            width, height, w, qCeil(static_cast<double>(faceHeight / nbSteps)),
            wp, xLeft, xRight, vecBackA.x(), vecBackB.x(), vecStepLeftB.x(),
            vecStepRightB.x(), yTop, vecStepRightB.y(), vecStepRightB.z(), zBack
            , vecStepLeftB.z(), vecStepRightB.z(), vecBackA.z(), vecBackB.z(),
            yOffset, vertices, indexes, count, 0, vecStepLeftB.distanceToPoint(
            vecStepRightB));
    }
}

// -------------------------------------------------------

void MountainDatas::drawSideCorner(int xKind, int yKind, float angle, QVector3D
    &center, int width, int height, float w, float faceHeight, int wp, float
    xLeft, float xRight, float xLeftTop, float xRightTop, float xLeftBot, float
    xRightBot, float yTop, float yBot, float zFront, float zBack, float
    zFrontLeft, float zFrontRight, float zBackLeft, float zBackRight, float
    yOffset, QVector<Vertex> &vertices, QVector<GLuint> &indexes, int &count,
    float xCornerOffsetTop, float xCornerOffsetBot)
{
    this->drawFace(xKind, yKind, angle, center, width, height, w, faceHeight,
        xLeft, xRight, xLeft, xRight, yTop, yBot, zFront, zFront, zBack, zBack,
        yOffset, vertices, indexes, count, 0, 0, false);

    // Draw corner only if there is a border width
    if (wp > 0) {
        this->drawFace(xKind, yKind, angle, center, width, height, w,
            faceHeight, xLeftTop, xRightTop, xLeftBot, xRightBot, yTop, yBot,
            zFrontLeft, zFrontRight, zBackLeft, zBackRight, yOffset, vertices,
            indexes, count, xCornerOffsetTop, xCornerOffsetBot, true);
    }
}

// -------------------------------------------------------

void MountainDatas::drawFace(int xKind, int yKind, float angle, QVector3D
    &center, int width, int height, float w, float faceHeight, float xLeftTop,
    float xRightTop, float xLeftBot, float xRightBot, float yTop, float yBot,
    float zFrontLeft, float zFrontRight, float zBackLeft, float zBackRight,
    float yOffset, QVector<Vertex> &vertices, QVector<GLuint> &indexes, int
    &count, float xCornerOffsetTop, float xCornerOffsetBot, bool isCorner)
{
    QVector3D vecA, vecB, vecC, vecD;
    QVector2D texA, texB, texC, texD;
    int squareSize;
    float x, y, h, coefX, coefY;

    squareSize = RPM::get()->getSquareSize();

    // Textures coordinates
    x = ((static_cast<float>(xKind) * squareSize)) / width;
    y = ((static_cast<float>(yKind) * squareSize) + (yKind == MountainDatas
        ::Y_BOT_OFFSET ? squareSize - faceHeight : 0) + yOffset) / height;
    h = faceHeight / height;
    coefX = 0.1f / width;
    coefY = 0.1f / height;
    x += coefX;
    y += coefY;
    w -= (coefX * 2);
    h -= (coefY * 2);

    // Textures and vertices
    if (isCorner) {
        texA = QVector2D(((static_cast<float>(xKind) * squareSize) + ((
            squareSize - xCornerOffsetTop) / 2)) / width + coefX, y);
        texB = QVector2D(((static_cast<float>(xKind + 1) * squareSize) - ((
            squareSize - xCornerOffsetTop) / 2)) / width - coefX, y);
        texC = QVector2D(((static_cast<float>(xKind + 1) * squareSize) - ((
            squareSize - xCornerOffsetBot) / 2)) / width - coefX, y + h);
        texD = QVector2D(((static_cast<float>(xKind) * squareSize) + ((
            squareSize - xCornerOffsetBot) / 2)) / width + coefX, y + h);
    } else { // Triangle form for corners
        texA = QVector2D(x, y);
        texB = QVector2D(x + w, y);
        texC = QVector2D(x + w, y + h);
        texD = QVector2D(x, y + h);
    }
    vecA = QVector3D(xLeftTop, yTop, zBackLeft);
    vecB = QVector3D(xRightTop, yTop, zBackRight);
    vecC = QVector3D(xRightBot, yBot, zFrontRight);
    vecD = QVector3D(xLeftBot, yBot, zFrontLeft);

    // Rotate and draw sprite side
    SpriteDatas::rotateSprite(vecA, vecB, vecC, vecD, center, angle);
    SpriteDatas::addStaticSpriteToBuffer(vertices, indexes, count, vecA,
        vecB, vecC, vecD, texA, texB, texC, texD);
}

// -------------------------------------------------------

bool MountainDatas::update(Position &position, Portion &portion, QHash<Position,
    MountainDatas *> &preview)
{
    bool previousLeft, previousRight, previousTop, previousBottom;
    int width, height;

    previousLeft = m_left;
    previousRight = m_right;
    previousTop = m_top;
    previousBottom = m_bot;
    width = this->widthTotalPixels();
    height = this->heightTotalPixels();

    m_left = Mountains::tileOnLeft(position, portion, m_specialID, width,
        height, preview);
    m_right = Mountains::tileOnRight(position, portion, m_specialID, width,
        height, preview);
    m_top = Mountains::tileOnTop(position, portion, m_specialID, width,
        height, preview);
    m_bot = Mountains::tileOnBottom(position, portion, m_specialID, width,
        height, preview);

    return m_left != previousLeft || m_right != previousRight || m_top !=
        previousTop || m_bot != previousBottom;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void MountainDatas::initializeVertices(QVector<Vertex> &vertices,
    QVector<GLuint> &indexes, TextureSeveral *texture, Position &position,
    int &count)
{
    QVector3D center, vecFrontA, vecBackA, vecFrontB, vecBackB;
    int squareSize, width, height, wp, hp;
    float yOffset, w, faceHeight, xLeft, xRight, yTop, yBot, zFront, zBack;

    // General configurations
    squareSize = RPM::get()->getSquareSize();
    yOffset = texture->getOffset(m_specialID, nullptr) * 4 * squareSize;
    wp = this->widthTotalPixels();
    hp = this->heightTotalPixels();
    width = 4 * squareSize;
    height = RPM::MAX_PIXEL_SIZE;
    faceHeight = static_cast<float>(qSqrt((wp * wp) + (hp * hp)));
    w = static_cast<float>(squareSize) / width;
    center.setX(position.x() * squareSize + (squareSize / 2));
    center.setY(position.getY(squareSize) + (squareSize / 2));
    center.setZ(position.z() * squareSize + (squareSize / 2));
    xLeft = position.x() * squareSize;
    xRight = (position.x() + 1) * squareSize;
    yTop = position.getY(squareSize) + hp;
    yBot = position.getY(squareSize);
    zFront = (position.z() + 1) * squareSize + wp;
    zBack = zFront - wp;
    vecFrontB.setX(xLeft);
    vecFrontB.setY(yBot);
    vecFrontB.setZ(zFront);
    vecBackB.setX(xLeft);
    vecBackB.setY(yTop);
    vecBackB.setZ(zBack);
    vecFrontA.setX(xLeft - wp);
    vecFrontA.setY(yBot);
    vecFrontA.setZ(zBack);
    vecBackA.setX(xLeft);
    vecBackA.setY(yTop);
    vecBackA.setZ(zBack);

    // Box collisions & overflow
    m_box = QBox3D(QVector3D(xLeft, yTop, position.z() * squareSize), QVector3D(
        xRight, yBot, (position.z() + 1) * squareSize));
    m_boxOverflow = QBox3D(QVector3D(xLeft - wp, yTop, (position.z() *
        squareSize) - wp), QVector3D(xRight + wp, yBot, ((position.z() + 1) *
        squareSize) + wp));

    // Bot
    if (!m_bot) {
        this->drawEntireFaces(m_left, m_right, 0, center, width, height, w,
            faceHeight, wp, xLeft, xRight, yTop, yBot, zFront, zBack, yOffset,
            vecFrontA, vecBackA, vecFrontB, vecBackB, vertices, indexes, count);
    }
    // Top
    if (!m_top) {
        this->drawEntireFaces(m_right, m_left, 180, center, width, height, w,
            faceHeight, wp, xLeft, xRight, yTop, yBot, zFront, zBack, yOffset,
            vecFrontA, vecBackA, vecFrontB, vecBackB, vertices, indexes, count);
    }
    // Left
    if (!m_left) {
        this->drawEntireFaces(m_top, m_bot, -90, center, width, height, w,
            faceHeight, wp, xLeft, xRight, yTop, yBot, zFront, zBack, yOffset,
            vecFrontA, vecBackA, vecFrontB, vecBackB, vertices, indexes, count);
    }
    // Right
    if (!m_right) {
        this->drawEntireFaces(m_bot, m_top, 90, center, width, height, w,
            faceHeight, wp, xLeft, xRight, yTop, yBot, zFront, zBack, yOffset,
            vecFrontA, vecBackA, vecFrontB, vecBackB, vertices, indexes, count);
    }
}

// -------------------------------------------------------

float MountainDatas::intersection(QRay3D &ray) const {
    float minDistance = 0;

    RPM::getMinDistance(minDistance, m_box.intersection(ray));

    return minDistance;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

MapEditorSelectionKind MountainDatas::getKind() const {
    return MapEditorSelectionKind::Mountains;
}

// -------------------------------------------------------

MapEditorSubSelectionKind MountainDatas::getSubKind() const {
    return MapEditorSubSelectionKind::Mountains;
}

// -------------------------------------------------------

QString MountainDatas::toString() const {
    return "MOUNTAIN";
}

// -------------------------------------------------------

void MountainDatas::read(const QJsonObject &json) {
    MapElement::read(json);

    if (json.contains(JSON_SPECIAL_ID)) {
        m_specialID = json[JSON_SPECIAL_ID].toInt();
    }
    if (json.contains(JSON_WIDTH_SQUARES)) {
        m_widthSquares = json[JSON_WIDTH_SQUARES].toInt();
    }
    if (json.contains(JSON_WIDTH_PIXELS)) {
        m_widthPixels = json[JSON_WIDTH_PIXELS].toDouble();
    }
    if (json.contains(JSON_HEIGHT_SQUARES)) {
        m_heightSquares = json[JSON_HEIGHT_SQUARES].toInt();
    }
    if (json.contains(JSON_HEIGHT_PIXELS)) {
        m_heightPixels = json[JSON_HEIGHT_PIXELS].toDouble();
    }
    if (json.contains(JSON_TOP)) {
        m_top = json[JSON_TOP].toBool();
    }
    if (json.contains(JSON_BOT)) {
        m_bot = json[JSON_BOT].toBool();
    }
    if (json.contains(JSON_LEFT)) {
        m_left = json[JSON_LEFT].toBool();
    }
    if (json.contains(JSON_RIGHT)) {
        m_right = json[JSON_RIGHT].toBool();
    }
}

// -------------------------------------------------------

void MountainDatas::write(QJsonObject &json) const {
    MapElement::write(json);

    if (m_specialID != -1) {
        json[JSON_SPECIAL_ID] = m_specialID;
    }
    if (m_widthSquares != 0) {
        json[JSON_WIDTH_SQUARES] = m_widthSquares;
    }
    if (m_widthPixels != 0.0) {
        json[JSON_WIDTH_PIXELS] = m_widthPixels;
    }
    if (m_heightSquares != 1) {
        json[JSON_HEIGHT_SQUARES] = m_heightSquares;
    }
    if (m_heightPixels != 0.0) {
        json[JSON_HEIGHT_PIXELS] = m_heightPixels;
    }
    if (m_top) {
        json[JSON_TOP] = m_top;
    }
    if (m_bot) {
        json[JSON_BOT] = m_bot;
    }
    if (m_left) {
        json[JSON_LEFT] = m_left;
    }
    if (m_right) {
        json[JSON_RIGHT] = m_right;
    }
}

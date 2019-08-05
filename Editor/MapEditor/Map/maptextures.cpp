/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QtMath>
#include "map.h"
#include "systemautotile.h"
#include "rpm.h"
#include "autotiles.h"

// -------------------------------------------------------

void Map::loadTextures() {
    QImage image;

    deleteTextures();

    // Tileset
    QImage imageTileset(1, 1, QImage::Format_ARGB32);
    QString path = m_mapProperties->tileset()->picture()->getPath(PictureKind
        ::Tilesets);
    if (!path.isEmpty()) {
        imageTileset = QImage(path);
    } else {
        imageTileset.fill(QColor(0, 0, 0, 0));
    }
    m_textureTileset = this->createTexture(imageTileset);

    // Texture missing
    image = QImage(RPM::PATH_TEXTURE_MISSING);
    m_textureMissing = this->createTexture(image);

    // Characters && walls && objects3D
    this->loadCharactersTextures();
    this->loadSpecialPictures(PictureKind::Walls, m_texturesSpriteWalls);
    this->loadSpecialPictures(PictureKind::Object3D, m_texturesObjects3D);
    this->loadAutotiles();
    this->loadMountains();

    // Object square
    image = QImage(":/textures/Ressources/object_square.png");
    m_textureObjectSquare = this->createTexture(image);
}

// -------------------------------------------------------

void Map::deleteTextures() {
    if (m_textureTileset != nullptr)
        delete m_textureTileset;
    deleteCharactersTextures();
    for (QHash<int, QOpenGLTexture*>::iterator i = m_texturesSpriteWalls.begin()
         ; i != m_texturesSpriteWalls.end(); i++)
    {
        if (*i != nullptr) {
            delete *i;
        }
    }
    m_texturesSpriteWalls.clear();
    for (QHash<int, QOpenGLTexture*>::iterator i = m_texturesObjects3D.begin()
         ; i != m_texturesObjects3D.end(); i++)
    {
        if (*i != nullptr) {
            delete *i;
        }
    }
    m_texturesObjects3D.clear();
    for (int i = 0; i < m_texturesAutotiles.size(); i++) {
        delete m_texturesAutotiles[i];
    }
    m_texturesAutotiles.clear();
    for (int i = 0; i < m_texturesMountains.size(); i++) {
        delete m_texturesMountains[i];
    }
    m_texturesMountains.clear();
    if (m_textureObjectSquare != nullptr) {
        delete m_textureObjectSquare;
    }
    if (m_textureMissing != nullptr) {
        delete m_textureMissing;
    }
}

// -------------------------------------------------------

void Map::deleteCharactersTextures() {
    for (QHash<int, QOpenGLTexture*>::iterator i = m_texturesCharacters.begin();
         i != m_texturesCharacters.end(); i++)
    {
        if (i.key() != 0) {
            delete *i;
        }
    }
    m_texturesCharacters.clear();
}

// -------------------------------------------------------

void Map::loadPictures(PictureKind kind, QHash<int, QOpenGLTexture*>& textures)
{
    SystemPicture *picture;
    QStandardItemModel* model = RPM::get()->project()->picturesDatas()
            ->model(kind);
    int id;

    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
        picture = reinterpret_cast<SystemPicture *>(model->item(i)->data().value
            <qintptr>());
        id = picture->id();
        if (id != 0) {
            QImage image;
            loadPicture(picture, kind, image);
            textures[id] = this->createTexture(image);
        }
    }
}

// -------------------------------------------------------

void Map::loadCharactersTextures()
{
    loadPictures(PictureKind::Characters, m_texturesCharacters);
    m_texturesCharacters.insert(0, m_textureTileset);
}

// -------------------------------------------------------

void Map::loadSpecialPictures(PictureKind kind,
                              QHash<int, QOpenGLTexture*>& textures)
{
    SystemSpecialElement* special;
    SystemTileset* tileset;
    QStandardItemModel *model, *modelSpecials;
    int id;
    bool loaded;

    tileset = m_mapProperties->tileset();
    modelSpecials = RPM::get()->project()->specialElementsDatas()->model(kind);
    model = tileset->model(kind);
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
        id = reinterpret_cast<SuperListItem *>(model->item(i)->data().value<
            qintptr>())->id();
        special = reinterpret_cast<SystemSpecialElement *>(SuperListItem
            ::getById(modelSpecials->invisibleRootItem(), id));
        if (id != -1) {
            QImage image;
            loaded = loadPicture(special->picture(), kind, image);
            textures[special->id()] = loaded ? this->createTexture(image) :
                nullptr;
        }
    }
    addEmptyPicture(textures);
}

// -------------------------------------------------------

bool Map::loadPicture(SystemPicture* picture, PictureKind kind, QImage& refImage)
{
    QImage image(1, 1, QImage::Format_ARGB32);
    refImage = image;
    QString path = picture->getPath(kind);

    if (path.isEmpty()) {
        image.fill(QColor(0, 0, 0, 0));
        return false;
    } else {
        image.load(path);
        if (!image.isNull()) {

            switch (kind) {
            case PictureKind::Walls:
                editPictureWall(image, refImage); break;
            default:
                refImage = image;
                break;
            }
            return true;
        }
        return false;
    }
}

// -------------------------------------------------------

void Map::loadAutotiles() {
    SystemSpecialElement* special;
    SystemTileset* tileset = m_mapProperties->tileset();
    QStandardItemModel* model = tileset->model(PictureKind::Autotiles);
    QStandardItemModel* modelSpecials = RPM::get()->project()
            ->specialElementsDatas()->model(PictureKind::Autotiles);
    int id;
    QImage newImage(64 * m_squareSize, RPM::MAX_PIXEL_SIZE,
                    QImage::Format_ARGB32);
    SystemPicture *picture;
    QPainter painter;
    painter.begin(&newImage);
    int offset = 0;
    TextureSeveral* textureAutotile = nullptr;
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
        id = reinterpret_cast<SuperListItem *>(model->item(i)->data().value<
            qintptr>())->id();
        special = reinterpret_cast<SystemSpecialElement *>(SuperListItem
            ::getById(modelSpecials->invisibleRootItem(), id, false));
        picture = special == nullptr ? RPM::get()->project()->picturesDatas()
            ->missingPicture() : special->picture();

        textureAutotile = loadPictureAutotile(painter, textureAutotile, newImage
            , picture, offset, id);
    }
    painter.end();

    if (offset > 0) {
        textureAutotile->setTexture(createTexture(newImage));
        m_texturesAutotiles.append(textureAutotile);
    }
}

// -------------------------------------------------------

TextureSeveral* Map::loadPictureAutotile(
        QPainter& painter, TextureSeveral *textureAutotile,
        QImage& newImage, SystemPicture* picture, int& offset, int id)
{
    QImage image(1, 1, QImage::Format_ARGB32);
    QString path = picture->getPath(PictureKind::Autotiles);

    if (path.isEmpty())
        image.fill(QColor(0, 0, 0, 0));
    else {
        image.load(path);
        if (!image.isNull()) {
            textureAutotile = editPictureAutotile(painter, textureAutotile,
                                                  newImage, image, offset, id);
        }
    }

    return textureAutotile;
}

// -------------------------------------------------------

void Map::editPictureWall(QImage& image, QImage& refImage) {
    QImage newImage(image.width() + RPM::get()->getSquareSize(),
                    image.height(), QImage::Format_ARGB32);
    QImage borderLeft =
            image.copy(0, 0, RPM::get()->getSquareSize() / 2, image.height());
    QImage borderRight =
            image.copy(image.width() - (RPM::get()->getSquareSize() / 2), 0,
                       RPM::get()->getSquareSize() / 2, image.height());
    QPainter paint;
    paint.begin(&newImage);
    paint.drawImage(0, 0, image);
    paint.drawImage(image.width(), 0, borderLeft);
    paint.drawImage(image.width() + RPM::get()->getSquareSize() / 2, 0,
                    borderRight);
    paint.end();
    refImage = newImage;
}

// -------------------------------------------------------

TextureSeveral * Map::editPictureAutotile(
        QPainter &painter, TextureSeveral *textureAutotile, QImage& newImage,
        QImage& image, int &offset, int id)
{
    int width = (image.width() / 2) / m_squareSize;
    int height = (image.height() / 3) / m_squareSize;
    int size = width * height;

    for (int i = 0; i < size; i++) {
        QPoint point(i % width, i / width);
        if (offset == 0 && textureAutotile == nullptr) {
            textureAutotile = new TextureSeveral;
            textureAutotile->setBegin(id, point);
        }
        paintPictureAutotile(painter, image, offset, point);
        textureAutotile->setEnd(id, point);
        textureAutotile->addToList(id, point);
        offset++;

        if (offset == 6) {
            painter.end();
            textureAutotile->setTexture(createTexture(newImage));
            m_texturesAutotiles.append(textureAutotile);
            newImage = QImage(64 * m_squareSize, RPM::MAX_PIXEL_SIZE,
                              QImage::Format_ARGB32);
            painter.begin(&newImage);
            textureAutotile = nullptr;
            offset = 0;
        }
    }

    return textureAutotile;
}

// -------------------------------------------------------

void Map::paintPictureAutotile(QPainter& painter, QImage& image, int& offset,
                               QPoint& point)
{
    int count, lA, lB, lC, lD, row = -1;
    int offsetX = point.x() * 2 * m_squareSize;
    int offsetY = point.y() * 3 * m_squareSize;
    float sDiv = m_squareSize / 2.0f;
    int y = offset * Autotiles::COUNT_LIST * 2;

    for (int a = 0; a < Autotiles::COUNT_LIST; a++) {
        lA = Autotiles::autotileBorder[Autotiles::listA[a]];
        count = 0;
        row++;
        for (int b = 0; b < Autotiles::COUNT_LIST; b++) {
            lB = Autotiles::autotileBorder[Autotiles::listB[b]];
            for (int c = 0; c < Autotiles::COUNT_LIST; c++) {
                lC = Autotiles::autotileBorder[Autotiles::listC[c]];
                for (int d = 0; d < Autotiles::COUNT_LIST; d++) {
                    lD = Autotiles::autotileBorder[Autotiles::listD[d]];

                    // Draw
                    painter.drawImage(count * m_squareSize,
                                      (row + y) * m_squareSize, image,
                                      (lA % 4 * sDiv) + offsetX,
                                      (lA / 4 * sDiv) + offsetY, sDiv, sDiv);
                    painter.drawImage(count * m_squareSize + sDiv,
                                      (row + y) * m_squareSize, image,
                                      (lB % 4 * sDiv) + offsetX,
                                      (lB / 4 * sDiv) + offsetY, sDiv, sDiv);
                    painter.drawImage(count * m_squareSize,
                                      (row + y) * m_squareSize + sDiv, image,
                                      (lC % 4 * sDiv) + offsetX,
                                      (lC / 4 * sDiv) + offsetY, sDiv, sDiv);
                    painter.drawImage(count * m_squareSize + sDiv,
                                      (row + y) * m_squareSize + sDiv, image,
                                      (lD % 4 * sDiv) + offsetX,
                                      (lD / 4 * sDiv) + offsetY, sDiv, sDiv);

                    count++;
                    if (count == 64) {
                        count = 0;
                        row++;
                    }
                }
            }
        }
    }
}

// -------------------------------------------------------

void Map::editPictureAutotilePreview(QImage& image, QImage& refImage) {
    QImage newImage(SystemAutotile::getPreviewWidth(image),
                    SystemAutotile::getPreviewHeight(image),
                    QImage::Format_ARGB32);
    QPainter paint;
    paint.begin(&newImage);
    int rows = SystemAutotile::getPreviewRows(image);
    int columns = SystemAutotile::getPreviewColumns(image);

    for (int i = 0; i < columns; i++) {
        for (int j = 0; j < rows; j++) {
            QRect out(i * RPM::get()->getSquareSize(),
                      j * RPM::get()->getSquareSize(),
                      RPM::get()->getSquareSize(),
                      RPM::get()->getSquareSize());
            QRect in(i * SystemAutotile::NUMBER_COLUMNS *
                     RPM::get()->getSquareSize(),
                     j * SystemAutotile::NUMBER_ROWS *
                     RPM::get()->getSquareSize(),
                     RPM::get()->getSquareSize(),
                     RPM::get()->getSquareSize());
            paint.drawImage(out, image, in);
        }
    }
    paint.end();
    refImage = newImage;
}

// -------------------------------------------------------

void Map::loadMountains() {
    SystemSpecialElement* special;
    SystemTileset *tileset;
    QStandardItemModel *model, *modelSpecials;
    QImage newImage;
    QPainter painter;
    int i, l, id, offset;
    TextureSeveral *textureMountain;
    SystemPicture *picture;

    tileset = m_mapProperties->tileset();
    model = tileset->model(PictureKind::Mountains);
    modelSpecials = RPM::get()->project()->specialElementsDatas()->model
        (PictureKind::Mountains);
    newImage = QImage(4 * m_squareSize, RPM::MAX_PIXEL_SIZE, QImage
        ::Format_ARGB32);
    painter.begin(&newImage);
    offset = 0;
    textureMountain = nullptr;
    for (i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        id = reinterpret_cast<SuperListItem *>(model->item(i)->data().value<
            qintptr>())->id();
        special = reinterpret_cast<SystemSpecialElement *>(SuperListItem
            ::getById(modelSpecials->invisibleRootItem(), id, false));
        picture = special == nullptr ? RPM::get()->project()->picturesDatas()
            ->missingPicture() : special->picture();
        textureMountain = loadPictureMountain(painter, textureMountain,
            newImage, picture, offset, id);
    }
    painter.end();

    if (offset > 0) {
        textureMountain->setTexture(createTexture(newImage));
        m_texturesMountains.append(textureMountain);
    }
}

// -------------------------------------------------------

TextureSeveral * Map::loadPictureMountain(QPainter& painter, TextureSeveral
    *textureMountain, QImage &newImage, SystemPicture *picture, int &offset, int
    id)
{
    QImage image;
    QString path;

    image = QImage(1, 1, QImage::Format_ARGB32);
    path = picture->getPath(PictureKind::Mountains);

    if (path.isEmpty()) {
        image.fill(QColor(0, 0, 0, 0));
    } else {
        image.load(path);
        if (!image.isNull()) {
            textureMountain = editPictureMountain(painter, textureMountain,
                newImage, image, offset, id);
        }
    }

    return textureMountain;
}

// -------------------------------------------------------

TextureSeveral * Map::editPictureMountain(QPainter &painter, TextureSeveral
    *textureMountain, QImage& newImage, QImage &image, int &offset, int id)
{
    int width = (image.width() / 3) / m_squareSize;
    int height = (image.height() / 3) / m_squareSize;
    int size = width * height;

    for (int i = 0; i < size; i++) {
        QPoint point(i % width, i / width);
        if (offset == 0 && textureMountain == nullptr) {
            textureMountain = new TextureSeveral;
            textureMountain->setBegin(id, point);
        }
        paintPictureMountain(painter, image, offset);
        textureMountain->setEnd(id, point);
        textureMountain->addToList(id, point);
        offset++;

        if (offset == this->getMaxMountainOffsetTexture()) {
            painter.end();
            textureMountain->setTexture(createTexture(newImage));
            m_texturesMountains.append(textureMountain);
            newImage = QImage(4 * m_squareSize, RPM::MAX_PIXEL_SIZE, QImage
                ::Format_ARGB32);
            painter.begin(&newImage);
            textureMountain = nullptr;
            offset = 0;
        }
    }

    return textureMountain;
}

// -------------------------------------------------------

void Map::paintPictureMountain(QPainter &painter, QImage &image, int &offset)
{
    int i, l, y, sourceSize, sDiv;

    y = offset * 4 * m_squareSize;
    sourceSize = 3 * m_squareSize;
    sDiv = qRound(m_squareSize / 2.0f);

    // Draw original image
    painter.drawImage(0, y, image);

    // Add left/right autos
    for (i = 0, l = 3; i < l; i++) {
        painter.drawImage(sourceSize, y + (i * m_squareSize), image, 0, (i *
            m_squareSize), sDiv, m_squareSize);
        painter.drawImage(sourceSize + sDiv, y + (i * m_squareSize), image,
            sourceSize - sDiv, (i * m_squareSize), sDiv, m_squareSize);
    }

    // Add top/bot autos
    for (i = 0, l = 3; i < l; i++) {
        painter.drawImage(i * m_squareSize, y + sourceSize, image, i *
            m_squareSize, 0, m_squareSize, sDiv);
        painter.drawImage(i * m_squareSize, y + sourceSize + sDiv, image, i *
            m_squareSize, sourceSize - sDiv, m_squareSize, sDiv);
    }

    // Add all sides autos
    painter.drawImage(sourceSize, y + sourceSize, image, 0, 0, sDiv, sDiv);
    painter.drawImage(sourceSize + sDiv, y + sourceSize, image, sourceSize -
        sDiv, 0, sDiv, sDiv);
    painter.drawImage(sourceSize, y + sourceSize + sDiv, image, 0, sourceSize -
        sDiv, sDiv, sDiv);
    painter.drawImage(sourceSize + sDiv, y + sourceSize + sDiv, image,
        sourceSize - sDiv, sourceSize - sDiv, sDiv, sDiv);
}

// -------------------------------------------------------

int Map::getMaxMountainOffsetTexture() const {
    return qFloor(RPM::MAX_PIXEL_SIZE / (4 * m_squareSize));
}

// -------------------------------------------------------

void Map::addEmptyPicture(QHash<int, QOpenGLTexture*>& textures) {
    QImage image(1, 1, QImage::Format_ARGB32);
    image.fill(QColor(0, 0, 0, 0));
    textures[-1] = new QOpenGLTexture(image);
}

// -------------------------------------------------------

QOpenGLTexture* Map::createTexture(QImage& image) {
    QOpenGLTexture* texture = new QOpenGLTexture(image);
    texture->setMinificationFilter(QOpenGLTexture::Filter::Nearest);
    texture->setMagnificationFilter(QOpenGLTexture::Filter::Nearest);

    return texture;
}

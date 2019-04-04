/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "map.h"
#include "systemautotile.h"
#include "rpm.h"
#include "autotiles.h"

// -------------------------------------------------------

void Map::loadTextures(){
    deleteTextures();

    // Tileset
    QImage imageTileset(1, 1, QImage::Format_ARGB32);
    QString path = m_mapProperties->tileset()->picture()->getPath(
        PictureKind::Tilesets);
    if (!path.isEmpty() && QFile::exists(path)) {
        imageTileset = QImage(path);
    }
    else {
        imageTileset.fill(QColor(0, 0, 0, 0));
    }
    m_textureTileset = createTexture(imageTileset);

    // Characters && walls
    loadCharactersTextures();
    loadSpecialPictures(PictureKind::Walls, m_texturesSpriteWalls);
    loadAutotiles();

    // Object square
    QImage imageObjectSquare(":/textures/Ressources/object_square.png");
    m_textureObjectSquare = createTexture(imageObjectSquare);
}

// -------------------------------------------------------

void Map::deleteTextures(){
    if (m_textureTileset != nullptr)
        delete m_textureTileset;
    deleteCharactersTextures();
    for (QHash<int, QOpenGLTexture*>::iterator i = m_texturesSpriteWalls.begin()
         ; i != m_texturesSpriteWalls.end(); i++)
    {
        delete *i;
    }
    m_texturesSpriteWalls.clear();
    for (int i = 0; i < m_texturesAutotiles.size(); i++)
        delete m_texturesAutotiles[i];
    m_texturesAutotiles.clear();
    if (m_textureObjectSquare != nullptr)
        delete m_textureObjectSquare;
}

// -------------------------------------------------------

void Map::deleteCharactersTextures() {
    for (QHash<int, QOpenGLTexture*>::iterator i = m_texturesCharacters.begin();
         i != m_texturesCharacters.end(); i++)
    {
        delete *i;
    }
    m_texturesCharacters.clear();
}

// -------------------------------------------------------

void Map::loadPictures(PictureKind kind,
                                 QHash<int, QOpenGLTexture*>& textures)
{
    SystemPicture* picture;
    QStandardItemModel* model = RPM::get()->project()->picturesDatas()
            ->model(kind);
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++){
        picture = (SystemPicture*) model->item(i)->data().value<qintptr>();
        QImage image;
        loadPicture(picture, kind, image);
        textures[picture->id()] = createTexture(image);
    }
}

// -------------------------------------------------------

void Map::loadCharactersTextures()
{
    loadPictures(PictureKind::Characters, m_texturesCharacters);
}

// -------------------------------------------------------

void Map::loadSpecialPictures(PictureKind kind,
                              QHash<int, QOpenGLTexture*>& textures)
{
    SystemSpecialElement* special;
    SystemTileset* tileset = m_mapProperties->tileset();
    QStandardItemModel* model = tileset->model(kind);
    QStandardItemModel* modelSpecials = RPM::get()->project()
            ->specialElementsDatas()->model(kind);
    int id;
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
        id = ((SuperListItem*) model->item(i)->data().value<qintptr>())->id();
        special = (SystemSpecialElement*) SuperListItem::getById(
                    modelSpecials->invisibleRootItem(), id);
        QImage image;
        loadPicture(special->picture(), kind, image);
        textures[special->id()] = createTexture(image);
    }
    addEmptyPicture(textures);
}

// -------------------------------------------------------

void Map::loadPicture(SystemPicture* picture, PictureKind kind,
                      QImage& refImage)
{
    QImage image(1, 1, QImage::Format_ARGB32);
    refImage = image;
    QString path = picture->getPath(kind);

    if (path.isEmpty())
        image.fill(QColor(0, 0, 0, 0));
    else {
        image.load(path);
        if (!image.isNull()) {
            switch (kind) {
            case PictureKind::Walls:
                editPictureWall(image, refImage); break;
            default:
                refImage = image;
                break;
            }
        }
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
    QPainter painter;
    painter.begin(&newImage);
    int offset = 0;
    TextureAutotile* textureAutotile = nullptr;
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
        id = ((SuperListItem*) model->item(i)->data().value<qintptr>())->id();
        special = (SystemSpecialElement*) SuperListItem::getById(
                    modelSpecials->invisibleRootItem(), id);
        textureAutotile = loadPictureAutotile(
            painter, textureAutotile, newImage, special->picture(), offset, id);
    }

    painter.end();
    if (offset > 0) {
        textureAutotile->setTexture(createTexture(newImage));
        m_texturesAutotiles.append(textureAutotile);
    }
}

// -------------------------------------------------------

TextureAutotile* Map::loadPictureAutotile(
        QPainter& painter, TextureAutotile *textureAutotile,
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

TextureAutotile* Map::editPictureAutotile(
        QPainter &painter, TextureAutotile* textureAutotile, QImage& newImage,
        QImage& image, int &offset, int id)
{
    int width = (image.width() / 2) / m_squareSize;
    int height = (image.height() / 3) / m_squareSize;
    int size = width * height;

    for (int i = 0; i < size; i++) {
        QPoint point(i % width, i / width);
        if (offset == 0 && textureAutotile == nullptr) {
            textureAutotile = new TextureAutotile;
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

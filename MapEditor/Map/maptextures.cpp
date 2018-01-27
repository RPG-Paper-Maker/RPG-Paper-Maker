/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "map.h"
#include "systemspecialelement.h"
#include "wanok.h"

// -------------------------------------------------------

void Map::loadTextures(){
    deleteTextures();

    // Tileset
    m_textureTileset = new QOpenGLTexture(
                QImage(m_mapProperties->tileset()->picture()
                       ->getPath(PictureKind::Tilesets)));
    m_textureTileset->setMinificationFilter(QOpenGLTexture::Filter::Nearest);
    m_textureTileset->setMagnificationFilter(QOpenGLTexture::Filter::Nearest);

    // Characters && walls
    loadCharactersTextures();
    loadSpecialPictures(PictureKind::Walls, m_texturesSpriteWalls);

    // Object square
    m_textureObjectSquare = new QOpenGLTexture(
                QImage(":/textures/Ressources/object_square.png"));
    m_textureObjectSquare->setMinificationFilter(
                QOpenGLTexture::Filter::Nearest);
    m_textureObjectSquare->setMagnificationFilter(
                QOpenGLTexture::Filter::Nearest);
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
}

// -------------------------------------------------------

void Map::loadPictures(PictureKind kind,
                                 QHash<int, QOpenGLTexture*>& textures)
{
    SystemPicture* picture;
    QStandardItemModel* model = Wanok::get()->project()->picturesDatas()
            ->model(kind);
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++){
        picture = (SystemPicture*) model->item(i)->data().value<qintptr>();
        loadPicture(picture, kind, textures, picture->id());
    }
}

// -------------------------------------------------------

void Map::loadCharactersTextures()
{
    m_texturesCharacters.clear();
    loadPictures(PictureKind::Characters, m_texturesCharacters);
}

// -------------------------------------------------------

void Map::loadSpecialPictures(PictureKind kind,
                              QHash<int, QOpenGLTexture*>& textures)
{
    SystemSpecialElement* special;
    SystemTileset* tileset = m_mapProperties->tileset();
    QStandardItemModel* model = tileset->model(kind);
    QStandardItemModel* modelSpecials = Wanok::get()->project()
            ->specialElementsDatas()->model(kind);
    int id;
    for (int i = 0; i < model->invisibleRootItem()->rowCount(); i++) {
        id = ((SuperListItem*) model->item(i)->data().value<qintptr>())->id();
        special = (SystemSpecialElement*) SuperListItem::getById(
                    modelSpecials->invisibleRootItem(), id);
        loadPicture(special->picture(), kind, textures, special->id());
    }
    addEmptyPicture(textures);
}

// -------------------------------------------------------

void Map::loadPicture(SystemPicture* picture, PictureKind kind,
                      QHash<int, QOpenGLTexture*>& textures, int id)
{
    QOpenGLTexture* texture;
    QImage image(1, 1, QImage::Format_ARGB32);
    QImage& refImage = image;
    QString path = picture->getPath(kind);

    if (path.isEmpty())
        image.fill(QColor(0, 0, 0, 0));
    else {
        image.load(path);
        if (!image.isNull() && kind == PictureKind::Walls)
            editPictureWall(image, refImage);
    }

    texture = new QOpenGLTexture(refImage);
    texture->setMinificationFilter(QOpenGLTexture::Filter::Nearest);
    texture->setMagnificationFilter(QOpenGLTexture::Filter::Nearest);
    textures[id] = texture;
}

// -------------------------------------------------------

void Map::editPictureWall(QImage& image, QImage& refImage) {
    QImage newImage(image.width() + m_squareSize, image.height(),
                    QImage::Format_ARGB32);
    QImage borderLeft =
            image.copy(0, 0, m_squareSize / 2, image.height());
    QImage borderRight =
            image.copy(image.width() - (m_squareSize / 2), 0,
                       m_squareSize / 2, image.height());
    QPainter paint;
    paint.begin(&newImage);
    paint.drawImage(0, 0, image);
    paint.drawImage(image.width(), 0, borderLeft);
    paint.drawImage(image.width() + m_squareSize / 2, 0, borderRight);
    paint.end();
    refImage = newImage;
}

// -------------------------------------------------------

void Map::addEmptyPicture(QHash<int, QOpenGLTexture*>& textures) {
    QImage image(1, 1, QImage::Format_ARGB32);
    image.fill(QColor(0, 0, 0, 0));
    textures[-1] = new QOpenGLTexture(image);
}

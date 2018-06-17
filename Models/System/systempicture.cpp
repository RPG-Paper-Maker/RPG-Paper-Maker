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

#include "systempicture.h"
#include "wanok.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPicture::SystemPicture() :
    SystemPicture(-1, "<None>", false)
{

}

SystemPicture::SystemPicture(int i, QString n, bool isBR) :
    SuperListItem(i,n),
    m_isBR(isBR),
    m_repeatCollisions(false)
{

}

SystemPicture::~SystemPicture() {
    for (QHash<QPoint, CollisionSquare*>::iterator i = m_collisions.begin();
         i != m_collisions.end(); i++)
    {
        delete *i;
    }
}

bool SystemPicture::isBR() const { return m_isBR; }

void SystemPicture::setIsBR(bool b) { m_isBR = b; }

QHash<QPoint, CollisionSquare*>* SystemPicture::collisions() {
    return &m_collisions;
}

bool SystemPicture::repeatCollisions() const {
    return m_repeatCollisions;
}

void SystemPicture::setRepeatCollisions(bool b, PictureKind kind) {
    m_repeatCollisions = b;

    // Clear collisions
    QImage image(this->getPath(kind));
    int xOffset = image.width() / Wanok::get()->project()->gameDatas()
            ->systemDatas()->framesAnimation() / Wanok::get()->getSquareSize();
    int yOffset = image.height() / 4 / Wanok::get()->getSquareSize();
    QHash<QPoint, CollisionSquare*> colCopy(m_collisions);
    if (b) {
        for (QHash<QPoint, CollisionSquare*>::iterator k = colCopy.begin();
             k != colCopy.end(); k++)
        {
            QPoint p = k.key();
            if (p.x() >= xOffset || p.y() >= yOffset) {
                delete k.value();
                m_collisions.remove(p);
            }
        }
    }
    else
        getRepeatList(image, colCopy, m_collisions, true);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString SystemPicture::getFolder(PictureKind kind, bool isBR){
    QString folder = isBR ? Wanok::get()->project()->gameDatas()->systemDatas()
                            ->pathBR()
                          : Wanok::get()->project()->pathCurrentProject();

    return Common::pathCombine(folder, getLocalFolder(kind));
}

// -------------------------------------------------------

QString SystemPicture::getLocalFolder(PictureKind kind){
    switch (kind){
    case PictureKind::Bars:
        return Wanok::pathBars;
    case PictureKind::Icons:
        return Wanok::pathIcons;
    case PictureKind::Autotiles:
        return Wanok::pathAutotiles;
    case PictureKind::Characters:
        return Wanok::pathCharacters;
    case PictureKind::Reliefs:
        return Wanok::pathReliefs;
    case PictureKind::Tilesets:
        return Wanok::pathTilesets;
    case PictureKind::Walls:
        return Wanok::PATH_SPRITE_WALLS;
    default:
        throw std::invalid_argument("Kind of picture path not implemented");
    }
}

// -------------------------------------------------------

QString SystemPicture::getPictureTitle(PictureKind kind) {
    switch(kind) {
    case PictureKind::Autotiles:
        return "Autotiles";
    case PictureKind::Walls:
        return "Walls";
    default:
        return "";
    }
}

// -------------------------------------------------------

QString SystemPicture::getPath(PictureKind kind) const{
    if (id() == -1)
        return "";

    QString folder = getFolder(kind, m_isBR);

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------

QString SystemPicture::getLocalPath(PictureKind kind) const{
    QString folder = getLocalFolder(kind);

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------

SuperListItem* SystemPicture::createCopy() const{
    SystemPicture* super = new SystemPicture;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemPicture::setCopy(const SystemPicture& super){
    SuperListItem::setCopy(super);

    m_isBR = super.m_isBR;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemPicture::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    QIcon icon = m_isBR ? QIcon(SuperListItem::pathIconBlue)
                        : QIcon(SuperListItem::pathIconRed);

    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));

    if (id() != -1)
        item->setIcon(icon);

    item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
    item->setText(toString());
    row.append(item);

    return row;
}

// -------------------------------------------------------

void SystemPicture::getRepeatList(QImage& image,
                                  QHash<QPoint, CollisionSquare *>& squares,
                                  QHash<QPoint, CollisionSquare*>& list,
                                  bool needsCopy) const
{
    int xOffset = image.width() / Wanok::get()->project()->gameDatas()
            ->systemDatas()->framesAnimation() / Wanok::get()->getSquareSize();
    int yOffset = image.height() / 4 / Wanok::get()->getSquareSize();
    for (QHash<QPoint, CollisionSquare*>::iterator k = squares.begin();
         k != squares.end(); k++)
    {
        QPoint p = k.key();
        for (int i = 0; i < Wanok::get()->project()->gameDatas()
             ->systemDatas()->framesAnimation(); i++)
        {
            for (int j = 0; j < 4; j++) {
                if (i != 0 || j != 0) {
                    list.insert(QPoint(p.x() + (i * xOffset),
                                       p.y() + (j * yOffset)),
                                needsCopy ? k.value()->createCopy() : k.value()
                    );
                }
            }
        }
    }
}

// -------------------------------------------------------

void SystemPicture::setDefaultLucas() {
    m_repeatCollisions = true;
    m_collisions.insert(QPoint(0, 0),
                        new CollisionSquare(new QRectF(81.25, 75, 18.75, 25)));
    m_collisions.insert(QPoint(1, 0),
                        new CollisionSquare(new QRectF(0, 75, 18.75, 25)));
    m_collisions.insert(QPoint(0, 1),
                        new CollisionSquare(new QRectF(56.25, 0, 43.75, 100)));
    m_collisions.insert(QPoint(1, 1),
                        new CollisionSquare(new QRectF(0, 0, 43.75, 100)));
}

// -------------------------------------------------------

void SystemPicture::setDefaultTilesetPlains() {
    m_collisions.insert(QPoint(0, 1),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
    m_collisions.insert(QPoint(0, 2),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
    m_collisions.insert(QPoint(1, 1),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
    m_collisions.insert(QPoint(1, 2),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));

    m_collisions.insert(QPoint(2, 1),
                        new CollisionSquare(new QRectF(12.5, 6.25,87.5,93.75)));
    m_collisions.insert(QPoint(2, 2),
                        new CollisionSquare(new QRectF(12.5, 0, 87.5, 100)));
    m_collisions.insert(QPoint(3, 1),
                        new CollisionSquare(new QRectF(0, 6.25, 87.5, 93.75)));
    m_collisions.insert(QPoint(3, 2),
                        new CollisionSquare(new QRectF(0, 0, 87.5, 100)));

    m_collisions.insert(QPoint(4, 1),
                        new CollisionSquare(new QRectF(18.75, 43.75, 62.5,
                                                       56.25)));
    m_collisions.insert(QPoint(5, 1),
                        new CollisionSquare(new QRectF(18.75, 37.5,62.5,62.5)));
}

// -------------------------------------------------------

void SystemPicture::setDefaultAutotiles() {
    m_collisions.insert(QPoint(2, 0),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
}

// -------------------------------------------------------

void SystemPicture::setDefaultWallInside() {
    m_collisions.insert(QPoint(0, 0),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
    m_collisions.insert(QPoint(1, 0),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
    m_collisions.insert(QPoint(2, 0),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
    m_collisions.insert(QPoint(0, 1),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
    m_collisions.insert(QPoint(1, 1),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
    m_collisions.insert(QPoint(2, 1),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
    m_collisions.insert(QPoint(0, 2),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
    m_collisions.insert(QPoint(1, 2),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
    m_collisions.insert(QPoint(2, 2),
                        new CollisionSquare(new QRectF(0, 0, 100, 100)));
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemPicture::read(const QJsonObject &json){
    SuperListItem::read(json);

    m_isBR = json["br"].toBool();

    // Collisions
    QJsonArray tabCollisions = json["col"].toArray();
    for (int i = 0; i < tabCollisions.size(); i++) {
        QJsonObject objHash = tabCollisions.at(i).toObject();
        QJsonArray tabKey = objHash["k"].toArray();
        QJsonObject objValue = objHash["v"].toObject();
        QPoint point;
        CollisionSquare* collision = new CollisionSquare;
        point.setX(tabKey.at(0).toInt());
        point.setY(tabKey.at(1).toInt());
        collision->read(objValue);
        m_collisions.insert(point, collision);
    }
    if (json.contains("rcol"))
        m_repeatCollisions = json["rcol"].toBool();
}

// -------------------------------------------------------

void SystemPicture::write(QJsonObject &json) const{
    SuperListItem::write(json);

    json["br"] = m_isBR;

    // Collisions
    QJsonArray tabCollisions;
    for (QHash<QPoint, CollisionSquare*>::const_iterator i=m_collisions.begin();
         i != m_collisions.end(); i++)
    {
        QPoint point = i.key();
        CollisionSquare* collision = i.value();
        QJsonObject objHash;
        QJsonArray tabKey;
        tabKey.append(point.x());
        tabKey.append(point.y());
        QJsonObject objValue;
        collision->write(objValue);
        objHash["k"] = tabKey;
        objHash["v"] = objValue;
        tabCollisions.append(objHash);
    }
    if (!tabCollisions.isEmpty())
        json["col"] = tabCollisions;
    if (m_repeatCollisions)
        json["rcol"] = m_repeatCollisions;
}

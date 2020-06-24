/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systempicture.h"
#include "rpm.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemPicture::SystemPicture() :
    SystemPicture(-1, "<" + RPM::translate(Translations::NONE) + ">", false)
{

}

SystemPicture::SystemPicture(int i, QString n, bool isBR, bool isMissing) :
    SuperListItem(i,n),
    m_isBR(isBR),
    m_repeatCollisions(false),
    m_isMissing(isMissing)
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
    int xOffset = image.width() / RPM::get()->project()->gameDatas()
            ->systemDatas()->framesAnimation() / RPM::get()->getSquareSize();
    int yOffset = image.height() / 4 / RPM::get()->getSquareSize();
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

SystemPicture * SystemPicture::getByID(int id, PictureKind kind) {
    return reinterpret_cast<SystemPicture *>(SuperListItem::getById(RPM::get()
        ->project()->picturesDatas()->model(kind)->invisibleRootItem(), id));
}

// -------------------------------------------------------

QString SystemPicture::getFolder(PictureKind kind, bool isBR){
    QString folder = isBR ? RPM::get()->project()->gameDatas()->systemDatas()
                            ->pathBR()
                          : RPM::get()->project()->pathCurrentProjectApp();

    return Common::pathCombine(folder, getLocalFolder(kind));
}

// -------------------------------------------------------

QString SystemPicture::getLocalFolder(PictureKind kind) {
    switch (kind){
    case PictureKind::Bars:
        return RPM::PATH_BARS;
    case PictureKind::Icons:
        return RPM::PATH_ICONS;
    case PictureKind::Autotiles:
        return RPM::PATH_AUTOTILES;
    case PictureKind::Characters:
        return RPM::PATH_CHARACTERS;
    case PictureKind::Mountains:
        return RPM::PATH_MOUNTAINS;
    case PictureKind::Tilesets:
        return RPM::PATH_TILESETS;
    case PictureKind::Walls:
        return RPM::PATH_SPRITE_WALLS;
    case PictureKind::Battlers:
        return RPM::PATH_BATTLERS;
    case PictureKind::Facesets:
        return RPM::PATH_FACESETS;
    case PictureKind::WindowSkins:
        return RPM::PATH_WINDOW_SKINS;
    case PictureKind::TitleScreen:
        return RPM::PATH_TITLE_SCREEN;
    case PictureKind::Object3D:
        return RPM::PATH_TEXTURES_OBJECT_3D;
    case PictureKind::Pictures:
        return RPM::PATH_HUD_PICTURES;
    case PictureKind::Animations:
        return RPM::PATH_HUD_ANIMATIONS;
    case PictureKind::SkyBoxes:
        return RPM::PATH_SKY_BOXES;
    default:
        throw std::invalid_argument("Kind of picture path not implemented");
    }
}

// -------------------------------------------------------

QString SystemPicture::getPictureTitle(PictureKind kind) {
    switch(kind) {
    case PictureKind::Autotiles:
        return RPM::translate(Translations::AUTOTILES);
    case PictureKind::Walls:
        return RPM::translate(Translations::WALLS);
    case PictureKind::Object3D:
        return RPM::translate(Translations::THREED_OBJECTS);
    case PictureKind::Mountains:
        return RPM::translate(Translations::MOUNTAINS);
    default:
        return "";
    }
}

// -------------------------------------------------------

PictureKind SystemPicture::subSelectionToPictureKind(MapEditorSubSelectionKind subKind)
{
    switch (subKind) {
    case MapEditorSubSelectionKind::Autotiles:
        return PictureKind::Autotiles;
    case MapEditorSubSelectionKind::SpritesWall:
        return PictureKind::Walls;
    default:
        return PictureKind::None;
    }
}

// -------------------------------------------------------

QString SystemPicture::getPath(PictureKind kind) const {
    // If NONE, return empty path
    if (id() == -1) {
        return "";
    } else if (m_isMissing) {
        return RPM::PATH_TEXTURE_MISSING;
    }

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

void SystemPicture::setCopy(const SuperListItem &super) {
    const SystemPicture *picture;

    SuperListItem::setCopy(super);

    picture = reinterpret_cast<const SystemPicture *>(&super);
    m_isBR = picture->m_isBR;
    QHash<QPoint, CollisionSquare*>::const_iterator i;
    for (i = picture->m_collisions.begin(); i != picture->m_collisions.end(); i++) {
        m_collisions.insert(i.key(), i.value()->createCopy());
    }
    m_repeatCollisions = picture->m_repeatCollisions;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemPicture::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    QIcon icon = m_isBR ? QIcon(SuperListItem::pathIconBlue)
                        : QIcon(SuperListItem::pathIconRed);

    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));

    if (id() > 0) {
        item->setIcon(icon);
    }

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
    int xOffset = image.width() / RPM::get()->project()->gameDatas()
            ->systemDatas()->framesAnimation() / RPM::get()->getSquareSize();
    int yOffset = image.height() / 4 / RPM::get()->getSquareSize();
    for (QHash<QPoint, CollisionSquare*>::iterator k = squares.begin();
         k != squares.end(); k++)
    {
        QPoint p = k.key();
        for (int i = 0; i < RPM::get()->project()->gameDatas()
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

void SystemPicture::setDefaultCharacterTileset() {
    p_id = 0;
    p_name = "Tileset";
}

// -------------------------------------------------------

void SystemPicture::getIcon(QIcon &icon) {
    QPixmap pix(this->getPath(PictureKind::Icons));

    icon = QIcon(pix);
}

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

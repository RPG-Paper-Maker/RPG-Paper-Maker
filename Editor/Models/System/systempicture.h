/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMPICTURE_H
#define SYSTEMPICTURE_H

#include <QMetaType>
#include "systemresource.h"
#include "picturekind.h"
#include "collisionsquare.h"
#include "mapeditorsubselectionkind.h"

// -------------------------------------------------------
//
//  CLASS SystemPicture
//
//  A particulary picture.
//
// -------------------------------------------------------

class SystemPicture : public SystemResource
{
public:
    SystemPicture();
    SystemPicture(int i, QString n, bool isBR, QString dlc = "", bool isMissing
        = false, PictureKind kind = PictureKind::None);
    virtual ~SystemPicture();
    void setKind(PictureKind k);
    QHash<QPoint, CollisionSquare*> *collisions();
    bool repeatCollisions() const;
    void setRepeatCollisions(bool b);

    static SystemPicture * getByID(int id, PictureKind kind);
    static QString getFolder(PictureKind kind, bool isBR = false, QString dlc =
        "");
    static QString getLocalFolder(PictureKind kind);
    static QString getPictureTitle(PictureKind kind);
    static PictureKind subSelectionToPictureKind(MapEditorSubSelectionKind
        subKind);

    void getRepeatList(QImage& image,
                       QHash<QPoint, CollisionSquare *>& squares,
                       QHash<QPoint, CollisionSquare *>& list,
                       bool needsCopy = false) const;
    void setDefaultLucas();
    void setDefaultTilesetPlains();
    void setDefaultAutotiles();
    void setDefaultWallInside();
    void setDefaultCharacterTileset();

    virtual QString getPath() const;
    virtual QString getLocalPath() const;
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
    virtual void getIcon(QIcon &icon);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    PictureKind m_kind;
    QHash<QPoint, CollisionSquare*> m_collisions;
    bool m_repeatCollisions;
    bool m_isMissing;
};

Q_DECLARE_METATYPE(SystemPicture)

#endif // SYSTEMPICTURE_H

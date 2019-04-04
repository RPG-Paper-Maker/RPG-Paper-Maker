/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMPICTURE_H
#define SYSTEMPICTURE_H

#include <QMetaType>
#include "superlistitem.h"
#include "picturekind.h"
#include "collisionsquare.h"

// -------------------------------------------------------
//
//  CLASS SystemPicture
//
//  A particulary picture.
//
// -------------------------------------------------------

class SystemPicture : public SuperListItem
{
public:
    SystemPicture();
    SystemPicture(int i, QString n, bool isBR);
    virtual ~SystemPicture();
    bool isBR() const;
    void setIsBR(bool b);
    QHash<QPoint, CollisionSquare*> *collisions();
    bool repeatCollisions() const;
    void setRepeatCollisions(bool b, PictureKind kind);
    static QString getFolder(PictureKind kind, bool isBR);
    static QString getLocalFolder(PictureKind kind);
    static QString getPictureTitle(PictureKind kind);
    QString getPath(PictureKind kind) const;
    QString getLocalPath(PictureKind kind) const;
    void getRepeatList(QImage& image,
                       QHash<QPoint, CollisionSquare *>& squares,
                       QHash<QPoint, CollisionSquare *>& list,
                       bool needsCopy = false) const;
    void setDefaultLucas();
    void setDefaultTilesetPlains();
    void setDefaultAutotiles();
    void setDefaultWallInside();

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemPicture &super);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isBR;
    QHash<QPoint, CollisionSquare*> m_collisions;
    bool m_repeatCollisions;
};

Q_DECLARE_METATYPE(SystemPicture)

#endif // SYSTEMPICTURE_H

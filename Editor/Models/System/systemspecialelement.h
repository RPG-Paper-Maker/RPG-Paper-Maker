/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMSPECIALELEMENT_H
#define SYSTEMSPECIALELEMENT_H

#include "superlistitem.h"
#include "systempicture.h"
#include "shapekind.h"
#include "objectcollisionkind.h"
#include "systemcustomshape.h"

// -------------------------------------------------------
//
//  CLASS SystemSpecialElement
//
//  A particulary special element.
//
// -------------------------------------------------------

class SystemSpecialElement : public SuperListItem
{
public:
    const static QString JSON_SHAPE_KIND;
    const static QString JSON_OBJ_ID;
    const static QString JSON_MTL_ID;
    const static QString JSON_PIC_ID;
    const static QString JSON_COLLISION_KIND;
    const static QString JSON_COLLISION_CUSTOM_ID;
    const static QString JSON_SCALE;
    const static QString JSON_WIDTH_SQUARE;
    const static QString JSON_WIDTH_PIXEL;
    const static QString JSON_HEIGHT_SQUARE;
    const static QString JSON_HEIGHT_PIXEL;
    const static QString JSON_DEPTH_SQUARE;
    const static QString JSON_DEPTH_PIXEL;

    SystemSpecialElement();
    SystemSpecialElement(int i, QString n, ShapeKind shapeKind = ShapeKind::Box,
        int objID = -1, int mtlID = -1, int pictureID = -1, ObjectCollisionKind
        collisionKind = ObjectCollisionKind::None, int collisionCustomID = -1,
        double scale = 1.0, int wS = 1, int wP = 0, int hS = 1, int hP = 0, int
        dS = 1, int dP = 0);
    virtual ~SystemSpecialElement();

    ShapeKind shapeKind() const;
    void setShapeKind(ShapeKind shape);
    SystemCustomShape * obj() const;
    SuperListItem * objID() const;
    SuperListItem * mtlID() const;
    int pictureID() const;
    void setPictureID(int id);
    ObjectCollisionKind collisionKind() const;
    void setCollisionKind(ObjectCollisionKind collisionKind);
    SuperListItem *collisionCustomID() const;
    double scale() const;
    void setScale(double scale);
    int widthSquare() const;
    void setWidthSquare(int ws);
    int widthPixel() const;
    void setWidthPixel(int wp);
    int heightSquare() const;
    void setHeightSquare(int hs);
    int heightPixel() const;
    void setHeightPixel(int hp);
    int depthSquare() const;
    void setDepthSquare(int ds);
    int depthPixel() const;
    void setDepthPixel(int dp);

    void updateObjName();
    void updateMtlName();
    void updateCustomCollisionName();
    void updateGenericObjectName(SuperListItem *obj, CustomShapeKind kind);

    virtual SystemPicture* picture() const;
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemSpecialElement &super);
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    ShapeKind m_shapeKind;
    SuperListItem *m_objID;
    SuperListItem *m_mtlID;
    int m_pictureID;
    ObjectCollisionKind m_collisionKind;
    SuperListItem *m_collisionCustomID;
    double m_scale;
    int m_widthSquare;
    int m_widthPixel;
    int m_heightSquare;
    int m_heightPixel;
    int m_depthSquare;
    int m_depthPixel;

    SystemPicture* pictureByKind(PictureKind kind) const;
};

Q_DECLARE_METATYPE(SystemSpecialElement)

#endif // SYSTEMSPECIALELEMENT_H

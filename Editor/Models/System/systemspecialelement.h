/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMSPECIALELEMENT_H
#define SYSTEMSPECIALELEMENT_H

#include "superlistitem.h"
#include "systempicture.h"
#include "shapekind.h"
#include "objectcollisionkind.h"
#include "systemcustomshape.h"
#include "mountaincollisionkind.h"

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
    const static QString JSON_STRETCH;
    const static QString JSON_MOUNTAIN_COLLISION_KIND;
    const static QString JSON_IS_ANIMATED;
    const static QString JSON_IS_TOP_LEFT;

    SystemSpecialElement();
    SystemSpecialElement(int i, QString n, ShapeKind shapeKind = ShapeKind::Box,
        int objID = -1, int mtlID = -1, int pictureID = -1, ObjectCollisionKind
        collisionKind = ObjectCollisionKind::None, int collisionCustomID = -1,
        double scale = 1.0, int wS = 1, double wP = 0, int hS = 1, double hP = 0
        , int dS = 1, double dP = 0, bool stretch = false, MountainCollisionKind
        mountainCollisionKind = MountainCollisionKind::Default, bool isAnimated
        = false, bool isTopLeft = true);
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
    int width() const;
    int widthSquare() const;
    void setWidthSquare(int ws);
    int widthPixel() const;
    double widthP() const;
    void setWidthPixel(int wp);
    int height() const;
    int heightSquare() const;
    void setHeightSquare(int hs);
    int heightPixel() const;
    double heightP() const;
    void setHeightPixel(int hp);
    int depth() const;
    int depthSquare() const;
    void setDepthSquare(int ds);
    int depthPixel() const;
    double depthP() const;
    void setDepthPixel(int dp);
    bool stretch() const;
    void setStretch(bool s);
    MountainCollisionKind mountainCollisionKind() const;
    void setMountainCollisionKind(MountainCollisionKind mountainCollisionKind);
    bool isAnimated() const;
    void setIsAnimated(bool isAnimated);
    bool isTopLeft() const;
    void setIsTopLeft(bool isTopLeft);

    void updateObjName();
    void updateMtlName();
    void updateCustomCollisionName();
    void updateGenericObjectName(SuperListItem *obj, CustomShapeKind kind);

    virtual SystemPicture* picture() const;
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);
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
    double m_widthPixel;
    int m_heightSquare;
    double m_heightPixel;
    int m_depthSquare;
    double m_depthPixel;
    bool m_stretch;
    MountainCollisionKind m_mountainCollisionKind;
    bool m_isAnimated;
    bool m_isTopLeft;

    SystemPicture* pictureByKind(PictureKind kind) const;
};

Q_DECLARE_METATYPE(SystemSpecialElement)

#endif // SYSTEMSPECIALELEMENT_H

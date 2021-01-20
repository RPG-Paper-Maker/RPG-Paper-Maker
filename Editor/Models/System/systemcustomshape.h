/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SYSTEMCUSTOMSHAPE_H
#define SYSTEMCUSTOMSHAPE_H

#include <QMetaType>
#include <QVector3D>
#include <QVector2D>
#include "systemresource.h"
#include "customshapekind.h"

// -------------------------------------------------------
//
//  CLASS SystemCustomShape
//
//  A particulary custom shape.
//
// -------------------------------------------------------

class SystemCustomShape : public SystemResource
{
public:
    const static QString PARSE_VERTEX;
    const static QString PARSE_NORMAL;
    const static QString PARSE_TEXTURE;
    const static QString PARSE_FACE;

    SystemCustomShape();
    SystemCustomShape(int i, QString n, bool isBR, QString dlc = "",
        CustomShapeKind kind = CustomShapeKind::None);
    virtual ~SystemCustomShape();
    void setKind(CustomShapeKind kind);
    QVector3D getVertexAt(int i) const;
    QVector2D getTextureAt(int i) const;
    QPair<int, int> getFace(int i) const;
    int facesCount() const;
    QVector3D minVertex() const;
    QVector3D maxVertex() const;

    static SystemCustomShape * getByID(int id, CustomShapeKind kind);
    static QString getFolder(CustomShapeKind kind, bool isBR = false, QString
        dlc = "");
    static QString getLocalFolder(CustomShapeKind kind);
    static QString getShapeTitle(CustomShapeKind kind);
    static QString getShapeExtension(CustomShapeKind kind);
    static QString getShapeExtensionBrowse(CustomShapeKind kind);

    void loadCustomObj();

    virtual QString getPath() const;
    virtual QString getLocalPath() const;
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem &super);

protected:
    CustomShapeKind m_kind;
    QList<QVector3D> m_vertices;
    QList<QVector2D> m_textures;
    QList<QPair<int, int>> m_faces;
    QVector3D m_minVertex;
    QVector3D m_maxVertex;
    bool m_loaded;
};

Q_DECLARE_METATYPE(SystemCustomShape)

#endif // SYSTEMCUSTOMSHAPE_H

/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
#include "superlistitem.h"
#include "customshapekind.h"

// -------------------------------------------------------
//
//  CLASS SystemCustomShape
//
//  A particulary custom shape.
//
// -------------------------------------------------------

class SystemCustomShape : public SuperListItem
{
public:
    static const QString JSON_BR;
    const static QString PARSE_VERTEX;
    const static QString PARSE_NORMAL;
    const static QString PARSE_TEXTURE;
    const static QString PARSE_FACE;

    SystemCustomShape();
    SystemCustomShape(int i, QString n, bool isBR);
    virtual ~SystemCustomShape();

    bool isBR() const;
    void setIsBR(bool b);
    QVector3D getVertexAt(int i) const;
    QVector2D getTextureAt(int i) const;
    QPair<int, int> getFace(int i) const;
    int facesCount() const;
    QVector3D minVertex() const;
    QVector3D maxVertex() const;

    static SystemCustomShape * getByID(int id, CustomShapeKind kind);
    static QString getFolder(CustomShapeKind kind, bool isBR);
    static QString getLocalFolder(CustomShapeKind kind);
    static QString getShapeTitle(CustomShapeKind kind);
    static QString getShapeExtension(CustomShapeKind kind);
    static QString getShapeExtensionBrowse(CustomShapeKind kind);

    QString getPath(CustomShapeKind kind) const;
    QString getLocalPath(CustomShapeKind kind) const;
    void loadCustomObj(CustomShapeKind kind);

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemCustomShape &super);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isBR;
    QList<QVector3D> m_vertices;
    QList<QVector2D> m_textures;
    QList<QPair<int, int>> m_faces;
    QVector3D m_minVertex;
    QVector3D m_maxVertex;
};

Q_DECLARE_METATYPE(SystemCustomShape)

#endif // SYSTEMCUSTOMSHAPE_H

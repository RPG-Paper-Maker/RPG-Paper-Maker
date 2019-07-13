/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SHAPESDATAS_H
#define SHAPESDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemcustomshape.h"

// -------------------------------------------------------
//
//  CLASS ShapesDatas
//
//  Contains all the possible shapes of a game. The data file is located in
//  Content/Datas/shapes.json.
//
// -------------------------------------------------------

class ShapesDatas : public Serializable
{
public:
    const static QString JSON_LIST;

    ShapesDatas();
    virtual ~ShapesDatas();
    void read(QString path);
    QStandardItemModel * model(CustomShapeKind kind) const;
    void setModel(CustomShapeKind kind, QStandardItemModel *model);

    void setDefault();
    void fillList(QList<SystemCustomShape *> &shapes, QList<QString> &names, CustomShapeKind kind);
    void setDefaultShapes(QList<QString>& names, CustomShapeKind kind);
    void setDefaultObj(QList<QString>& names);
    void setDefaultMtl(QList<QString>& names);
    void setDefaultCollisions(QList<QString>& names);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QHash<CustomShapeKind, QStandardItemModel*> m_models;
};

#endif // SHAPESDATAS_H

/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "shapesdatas.h"
#include "rpm.h"
#include "common.h"

const QString ShapesDatas::JSON_LIST = "list";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ShapesDatas::ShapesDatas() {

}

ShapesDatas::~ShapesDatas() {
    QHash<CustomShapeKind, QStandardItemModel*>::iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++) {
        SuperListItem::deleteModel(i.value());
    }
}

void ShapesDatas::read(QString path) {
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_SHAPES_DATAS), *this);
}

QStandardItemModel * ShapesDatas::model(CustomShapeKind kind) const {
    return m_models[kind];
}

void ShapesDatas::setModel(CustomShapeKind kind, QStandardItemModel *model) {
    m_models[kind] = model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ShapesDatas::setDefault() {
    QList<QString> names;

    setDefaultObj(names);
    setDefaultMtl(names);
}

// -------------------------------------------------------

void ShapesDatas::fillList(QList<SystemCustomShape *> &shapes, QList<QString>
    &names, CustomShapeKind kind)
{
    int i;

    shapes << new SystemCustomShape;
    for (i = 0; i < names.size() ; i++) {
        shapes << new SystemCustomShape(i + 1, names.at(i) + SystemCustomShape
            ::getShapeExtension(kind), true);
    }
}

// -------------------------------------------------------

void ShapesDatas::setDefaultShapes(QList<QString> &names, CustomShapeKind kind)
{
    QList<SystemCustomShape *> shapes;
    fillList(shapes, names, kind);

    QStandardItemModel* model = new QStandardItemModel;
    QList<QStandardItem*> row;

    for (int i = 0; i < shapes.size(); i++) {
        row = shapes.at(i)->getModelRow();
        model->appendRow(row);
    }
    m_models[kind] = model;

    names.clear();
}

// -------------------------------------------------------

void ShapesDatas::setDefaultObj(QList<QString>& names) {
    setDefaultShapes(names, CustomShapeKind::OBJ);
}

// -------------------------------------------------------

void ShapesDatas::setDefaultMtl(QList<QString>& names) {
    setDefaultShapes(names, CustomShapeKind::MTL);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void ShapesDatas::read(const QJsonObject &json){
    QJsonArray jsonList = json[JSON_LIST].toArray();
    QJsonObject jsonObj;
    QJsonArray jsonArray;
    QStandardItemModel *model;
    QList<QStandardItem *> row;

    // Clear
    QHash<CustomShapeKind, QStandardItemModel *>::iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++) {
        SuperListItem::deleteModel(i.value());
    }

    // Read
    for (int i = 0; i < jsonList.size(); i++) {
        jsonObj = jsonList.at(i).toObject();
        jsonArray = jsonObj[RPM::JSON_VALUE].toArray();
        model = new QStandardItemModel;

        for (int j = 0; j < jsonArray.size(); j++) {
            SystemCustomShape *super = new SystemCustomShape;
            super->read(jsonArray[j].toObject());
            row = super->getModelRow();
            model->appendRow(row);
        }

        m_models[static_cast<CustomShapeKind>(jsonObj[RPM::JSON_KEY].toInt())] =
            model;
    }
}

// -------------------------------------------------------

void ShapesDatas::write(QJsonObject &json) const {
    QJsonArray jsonFinalArray;
    QStandardItemModel *model;

    QHash<CustomShapeKind, QStandardItemModel*>::const_iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++) {
        model = i.value();
        QJsonObject jsonObj;
        QJsonArray jsonArray;
        jsonObj[RPM::JSON_KEY] = static_cast<int>(i.key());
        for (int j = 0; j < model->invisibleRootItem()->rowCount(); j++) {
            QJsonObject jsonObjPicture;
            SystemCustomShape *super = reinterpret_cast<SystemCustomShape *>(
                model->item(j)->data().value<quintptr>());
            super->write(jsonObjPicture);
            jsonArray.append(jsonObjPicture);
        }
        jsonObj[RPM::JSON_VALUE] = jsonArray;
        jsonFinalArray.append(jsonObj);
    }

    json[JSON_LIST] = jsonFinalArray;
}

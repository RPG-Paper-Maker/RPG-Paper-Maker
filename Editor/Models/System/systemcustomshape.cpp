/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "systemcustomshape.h"
#include "rpm.h"
#include "common.h"

const QString SystemCustomShape::JSON_BR = "br";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCustomShape::SystemCustomShape() :
    SystemCustomShape(-1, "<None>", false)
{

}

SystemCustomShape::SystemCustomShape(int i, QString n, bool isBR) :
    SuperListItem(i, n),
    m_isBR(isBR)
{

}

SystemCustomShape::~SystemCustomShape() {

}

bool SystemCustomShape::isBR() const {
    return m_isBR;
}

void SystemCustomShape::setIsBR(bool b) {
    m_isBR = b;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemCustomShape * SystemCustomShape::getByID(int id, CustomShapeKind kind) {
    return reinterpret_cast<SystemCustomShape *>(SuperListItem::getById(RPM::get()
        ->project()->shapesDatas()->model(kind)->invisibleRootItem(), id));
}

// -------------------------------------------------------

QString SystemCustomShape::getFolder(CustomShapeKind kind, bool isBR) {
    QString folder = isBR ? RPM::get()->project()->gameDatas()->systemDatas()
        ->pathBR() : RPM::get()->project()->pathCurrentProject();

    return Common::pathCombine(folder, getLocalFolder(kind));
}

// -------------------------------------------------------

QString SystemCustomShape::getLocalFolder(CustomShapeKind kind) {
    switch (kind) {
    case CustomShapeKind::OBJ:
        return RPM::PATH_OBJ;
    case CustomShapeKind::MTL:
        return RPM::PATH_MTL;
    default:
        throw std::invalid_argument("Kind of shape path not implemented");
    }
}

// -------------------------------------------------------

QString SystemCustomShape::getShapeTitle(CustomShapeKind kind) {
    switch(kind) {
    case CustomShapeKind::OBJ:
        return "OBJ";
    case CustomShapeKind::MTL:
        return "MTL";
    default:
        return "";
    }
}

// -------------------------------------------------------

QString SystemCustomShape::getShapeExtension(CustomShapeKind kind) {
    switch(kind) {
    case CustomShapeKind::OBJ:
        return ".obj";
    case CustomShapeKind::MTL:
        return ".mtl";
    default:
        return "";
    }
}

// -------------------------------------------------------

QString SystemCustomShape::getShapeExtensionBrowse(CustomShapeKind kind) {
    switch(kind) {
    case CustomShapeKind::OBJ:
        return "OBJ (*.obj)";
    case CustomShapeKind::MTL:
        return "MTL (*.mtl)";
    default:
        return "";
    }
}

// -------------------------------------------------------

QString SystemCustomShape::getPath(CustomShapeKind kind) const {
    if (id() == -1)
        return "";

    QString folder = getFolder(kind, m_isBR);

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------

QString SystemCustomShape::getLocalPath(CustomShapeKind kind) const {
    QString folder = getLocalFolder(kind);

    return Common::pathCombine(folder, name());
}

// -------------------------------------------------------

SuperListItem* SystemCustomShape::createCopy() const {
    SystemCustomShape* super = new SystemCustomShape;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCustomShape::setCopy(const SystemCustomShape& super){
    SuperListItem::setCopy(super);

    m_isBR = super.m_isBR;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemCustomShape::getModelRow() const {
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    QIcon icon = m_isBR ? QIcon(SuperListItem::pathIconBlue) : QIcon(
        SuperListItem::pathIconRed);

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
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemCustomShape::read(const QJsonObject &json) {
    SuperListItem::read(json);

    m_isBR = json[JSON_BR].toBool();
}

// -------------------------------------------------------

void SystemCustomShape::write(QJsonObject &json) const {
    SuperListItem::write(json);

    json[JSON_BR] = m_isBR;
}

/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SYSTEMCUSTOMSHAPE_H
#define SYSTEMCUSTOMSHAPE_H

#include <QMetaType>
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

    SystemCustomShape();
    SystemCustomShape(int i, QString n, bool isBR);
    virtual ~SystemCustomShape();

    bool isBR() const;
    void setIsBR(bool b);

    static SystemCustomShape * getByID(int id, CustomShapeKind kind);
    static QString getFolder(CustomShapeKind kind, bool isBR);
    static QString getLocalFolder(CustomShapeKind kind);
    static QString getShapeTitle(CustomShapeKind kind);
    static QString getShapeExtension(CustomShapeKind kind);
    static QString getShapeExtensionBrowse(CustomShapeKind kind);

    QString getPath(CustomShapeKind kind) const;
    QString getLocalPath(CustomShapeKind kind) const;

    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SystemCustomShape &super);
    virtual QList<QStandardItem*> getModelRow() const;

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isBR;
};

Q_DECLARE_METATYPE(SystemCustomShape)

#endif // SYSTEMCUSTOMSHAPE_H

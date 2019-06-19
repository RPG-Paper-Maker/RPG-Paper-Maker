/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef OBJECT3D_H
#define OBJECT3D_H

#include "mapelement.h"
#include "shapekind.h"
#include "systemobject3d.h"

// -------------------------------------------------------
//
//  CLASS Object3DDatas
//
//  A 3D object datas.
//
// -------------------------------------------------------

class Object3DDatas : public MapElement
{
public:
    const static QString JSON_DATAS_ID;

    Object3DDatas();
    Object3DDatas(int datasID, SystemObject3D *datas);
    virtual ~Object3DDatas();

    int textureID() const;

    bool operator==(const Object3DDatas& other) const;
    bool operator!=(const Object3DDatas& other) const;

    virtual MapEditorSelectionKind getKind() const;
    virtual MapEditorSubSelectionKind getSubKind() const;
    virtual QString toString() const;
    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    int m_datasID;
    SystemObject3D *m_datas;
};

#endif // OBJECT3D_H

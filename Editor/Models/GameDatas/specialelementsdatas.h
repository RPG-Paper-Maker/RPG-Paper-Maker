/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#ifndef SPECIALELEMENTSDATAS_H
#define SPECIALELEMENTSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemspecialelement.h"

// -------------------------------------------------------
//
//  CLASS SpecialElementsDatas
//
//  Contains all the possible special elements of a game. The data file is
//  located in Content/Datas/specialElements.json.
//
// -------------------------------------------------------

class SpecialElementsDatas : public Serializable
{
public:
    static const QString JSON_WALLS;
    static const QString JSON_AUTOTILES;
    static const QString JSON_OBJECTS_3D;
    static const QString JSON_MOUNTAINS;

    SpecialElementsDatas();
    virtual ~SpecialElementsDatas();
    void read(QString path);
    QStandardItemModel* model(PictureKind kind) const;
    QStandardItemModel* modelAutotiles() const;
    QStandardItemModel* modelSpriteWalls() const;
    QStandardItemModel* modelObjects3D() const;
    QStandardItemModel* modelMountains() const;
    void setDefault();
    void setDefaultSpriteWalls();
    void setDefaultAutotiles();
    void setDefaulObjects3D();
    void setDefaulMountains();
    void addDefaultSpecial(SystemSpecialElement *special, QStandardItemModel
        *model);

    virtual void read(const QJsonObject &json);
    void readSpecials(const QJsonObject &json, PictureKind kind,
                      QString jsonName);
    virtual void write(QJsonObject &json) const;
    void writeSpecials(QJsonObject &json, PictureKind kind,
                       QString jsonName) const;

protected:
    QStandardItemModel* m_modelAutotiles;
    QStandardItemModel* m_modelSpriteWalls;
    QStandardItemModel* m_modelObjects3D;
    QStandardItemModel* m_modelMountains;
};

#endif // SPECIALELEMENTSDATAS_H

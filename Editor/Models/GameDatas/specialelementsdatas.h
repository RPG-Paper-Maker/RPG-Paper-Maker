/*
    RPG Paper Maker Copyright (C) 2017-2023 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef SPECIALELEMENTSDATAS_H
#define SPECIALELEMENTSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemobject3d.h"

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
    SystemObject3D * missingObject3D() const;

    void setDefaultTranslations();

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
    SystemObject3D *m_missingObject3D;
};

#endif // SPECIALELEMENTSDATAS_H

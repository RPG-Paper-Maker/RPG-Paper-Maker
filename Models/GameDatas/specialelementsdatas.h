/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#ifndef SPECIALELEMENTSDATAS_H
#define SPECIALELEMENTSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "picturekind.h"

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
    SpecialElementsDatas();
    virtual ~SpecialElementsDatas();
    static const QString JSON_WALLS;
    static const QString JSON_AUTOTILES;
    void read(QString path);
    QStandardItemModel* model(PictureKind kind) const;
    QStandardItemModel* modelAutotiles() const;
    QStandardItemModel* modelSpriteWalls() const;
    QStandardItemModel* model3DObjects() const;
    QStandardItemModel* modelReliefs() const;
    void setDefault();
    void setDefaultSpriteWalls();
    void setDefaultAutotiles();

    virtual void read(const QJsonObject &json);
    void readSpecials(const QJsonObject &json, PictureKind kind,
                      QString jsonName);
    virtual void write(QJsonObject &json) const;
    void writeSpecials(QJsonObject &json, PictureKind kind,
                       QString jsonName) const;

private:
    QStandardItemModel* m_modelAutotiles;
    QStandardItemModel* m_modelSpriteWalls;
    QStandardItemModel* m_model3DObjects;
    QStandardItemModel* m_modelReliefs;
};

#endif // SPECIALELEMENTSDATAS_H

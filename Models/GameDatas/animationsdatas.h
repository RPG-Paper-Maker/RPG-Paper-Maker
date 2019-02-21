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

#ifndef ANIMATIONSDATAS_H
#define ANIMATIONSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS AnimationsDatas
//
//  Contains all the possible armors of a game. The data file is located in
//  Content/Datas/animations.json.
//
// -------------------------------------------------------

class AnimationsDatas : public Serializable
{
public:
    static const QString JSON_ANIMATIONS;

    AnimationsDatas();
    virtual ~AnimationsDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // ANIMATIONSDATAS_H

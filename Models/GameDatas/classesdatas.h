/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

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

#ifndef CLASSESDATAS_H
#define CLASSESDATAS_H

#include <QStandardItemModel>
#include "serializable.h"

// -------------------------------------------------------
//
//  CLASS ClassesDatas
//
//  Contains all the possible classes of a game. The data file is located in
//  Content/Datas/classes.json.
//
// -------------------------------------------------------

class ClassesDatas : public Serializable
{
public:
    ClassesDatas();
    virtual ~ClassesDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    void setDefault(QStandardItem* modelSkills, QStandardItem *modelStatistics);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // CLASSESDATAS_H

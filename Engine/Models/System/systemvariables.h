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

#ifndef SYSTEMVARIABLES_H
#define SYSTEMVARIABLES_H

#include<QStandardItemModel>
#include <QMetaType>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemVariables
//
//  An object representing the variables and switches items.
//
// -------------------------------------------------------

class SystemVariables : public SuperListItem
{
public:
    SystemVariables();
    SystemVariables(int i, QString n, QStandardItemModel* m);
    virtual ~SystemVariables();
    static int variablesPerPage;
    QStandardItemModel* model() const;
    virtual QString idToString() const;
    SuperListItem* getById(int id) const;
    virtual void read(const QJsonObject &json);
    void readCommand(const QJsonArray &json);
    virtual void write(QJsonObject &json) const;
    QJsonArray getArrayJSON() const;

private:
    QStandardItemModel* p_model;
};

Q_DECLARE_METATYPE(SystemVariables)

#endif // SYSTEMVARIABLES_H

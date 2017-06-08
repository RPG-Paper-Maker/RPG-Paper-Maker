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

#ifndef VARIABLESSWITCHESDATAS_H
#define VARIABLESSWITCHESDATAS_H

#include "serializable.h"
#include <QStandardItemModel>
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS VariablesSwitchesDatas
//
//  Contains all the variables and switches. The variables are
//  a simple array of int, and the switches an array of booleans.
//
// -------------------------------------------------------

class VariablesSwitchesDatas : public Serializable
{
public:
    VariablesSwitchesDatas();
    virtual ~VariablesSwitchesDatas();
    void read(QString path);
    void setDefault();
    QStandardItemModel* modelVariables() const;
    QStandardItemModel* modelSwitches() const;
    virtual void read(const QJsonObject &json);
    void readCommand(const QJsonArray &json, QStandardItemModel* l);
    virtual void write(QJsonObject &json) const;
    QJsonArray getArrayJSON(QStandardItemModel* l) const;
    SuperListItem* getVariableById(int id) const;
    SuperListItem* getSwitchById(int id) const;

private:
    QStandardItemModel* p_modelVariables;
    QStandardItemModel* p_modelSwitches;
    static QStandardItem* getDefaultItem(int i);
    SuperListItem* getById(QStandardItemModel *l, int id) const;
    void deleteModel(QStandardItem* item);
};

#endif // VARIABLESSWITCHESDATAS_H

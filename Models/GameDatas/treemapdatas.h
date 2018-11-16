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

#ifndef TREEMAPDATAS_H
#define TREEMAPDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "treemaptag.h"

// -------------------------------------------------------
//
//  CLASS TreeMapDatas
//
//  The data file is located in
//  Content/Datas/treeMap.json.
//
// -------------------------------------------------------

class TreeMapDatas : public Serializable
{
public:
    TreeMapDatas();
    virtual ~TreeMapDatas();
    void read(QString path);
    QStandardItemModel* model() const;
    QStandardItem* root() const;
    void setDefault();
    void addMapSelectorDir();
    void clearModel();
    static QStandardItem* add(QStandardItem *root, int i, TreeMapTag *tag,
                              QString iconName);
    static QStandardItem* addDir(QStandardItem *root, int i, TreeMapTag *tag);
    static QStandardItem* addMap(QStandardItem *root, int i, TreeMapTag *tag);
    static void setName(QStandardItem *item, QString name);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;

private:
    void readRoot(const QJsonArray &json, QStandardItem* root);
    QJsonArray getChildrenJSON(QStandardItem* item) const;
};

#endif // TREEMAPDATAS_H

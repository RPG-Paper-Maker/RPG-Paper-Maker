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

#ifndef TREEMAPTAG_H
#define TREEMAPTAG_H

#include "superlistitem.h"
#include <QVector3D>

// -------------------------------------------------------
//
//  CLASS TreeMapTag
//
//  A tag for each node in the map selector.
//
// -------------------------------------------------------

class TreeMapTag : public SuperListItem
{
public:
    TreeMapTag();
    TreeMapTag(int i, QString n);
    virtual ~TreeMapTag();
    static TreeMapTag* createDir(QString name);
    static TreeMapTag* createMap(QString name, int id);
    bool isDir() const;
    QString realName() const;
    QVector3D *position() const;
    static void copyItem(const QStandardItem* from, QStandardItem* to);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    QVector3D* m_position;
};

Q_DECLARE_METATYPE(TreeMapTag)

#endif // TREEMAPTAG_H

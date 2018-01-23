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

#ifndef SUPERLISTITEM_H
#define SUPERLISTITEM_H

#include <QString>
#include <QMetaType>
#include <QStandardItem>
#include <QComboBox>
#include "serializable.h"
#include "picturekind.h"

// -------------------------------------------------------
//
//  CLASS SuperListItem
//
//  All the classes inheriting this can be an item of a
//  SuperList.
//
// -------------------------------------------------------

class SuperListItem : public Serializable
{
public:
    SuperListItem();
    virtual ~SuperListItem();
    SuperListItem(int i, QString n);
    int id() const;
    virtual void setId(int i);
    virtual QString name() const;
    virtual void setName(QString n);
    virtual QString toString() const;
    virtual QString toStringName() const;
    static QString beginningText;
    virtual QString idToString() const;
    virtual void setDefault();
    virtual bool openDialog();
    virtual SuperListItem* createCopy() const;
    virtual void setCopy(const SuperListItem& item);
    virtual QList<QStandardItem*> getModelRow() const;
    static void deleteModel(QStandardItemModel* model, bool deleteModel = true);
    static void deleteModelTree(QStandardItem* item);
    static int getIndexById(QStandardItem* item, int id);
    static int getIdByIndex(QStandardItemModel* model, int index);
    static SuperListItem* getById(QStandardItem* item, int id,
                                  bool first = true);
    static void fillComboBox(QComboBox* comboBox, QStandardItemModel* model);
    static void copyModel(QStandardItemModel* model,
                          QStandardItemModel* baseModel);
    static SuperListItem* getnewInstance(PictureKind kind);

    virtual void read(const QJsonObject &json);
    void readId(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;
    void writeId(QJsonObject &json) const;

protected:
    int p_id;
    QString p_name;
};

Q_DECLARE_METATYPE(SuperListItem)

#endif // SUPERLISTITEM_H

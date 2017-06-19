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

#include "picturesdatas.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PicturesDatas::PicturesDatas()
{

}

PicturesDatas::~PicturesDatas()
{
    QHash<PictureKind, QStandardItemModel*>::iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++)
        SuperListItem::deleteModel(i.value());
}

void PicturesDatas::read(QString path){
    Wanok::readJSON(Wanok::pathCombine(path, Wanok::pathPicturesDatas), *this);
}

QStandardItemModel* PicturesDatas::model(PictureKind kind) const {
    return m_models[kind];
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PicturesDatas::setDefault(){
    QList<SystemPicture*> pictures;

    pictures << new SystemPicture;
    setDefaultPictures(pictures, PictureKind::Bars);
    pictures.clear();
    pictures << new SystemPicture;
    setDefaultPictures(pictures, PictureKind::Icons);
    pictures.clear();
    pictures << new SystemPicture;
    setDefaultPictures(pictures, PictureKind::Autotiles);
    pictures.clear();
    pictures << new SystemPicture;
    setDefaultPictures(pictures, PictureKind::Characters);
    pictures.clear();
    pictures << new SystemPicture;
    setDefaultPictures(pictures, PictureKind::Reliefs);
    pictures.clear();
    pictures << new SystemPicture;
    setDefaultPictures(pictures, PictureKind::Tilesets);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultPictures(QList<SystemPicture*>& pictures,
                                       PictureKind kind)
{
    QStandardItem* item;
    QStandardItemModel* model = new QStandardItemModel;

    for (int i = 0; i < pictures.size(); i++){
        item = new QStandardItem;
        item->setData(
                    QVariant::fromValue(
                        reinterpret_cast<quintptr>(pictures[i])));
        item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
        item->setText(pictures[i]->toString());
        model->appendRow(item);
    }
    m_models[kind] = model;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void PicturesDatas::read(const QJsonObject &json){
    QJsonArray jsonList = json["list"].toArray();
    QJsonObject jsonObj;
    QJsonArray jsonArray;
    QStandardItemModel* model;

    for (int i = 0; i < jsonList.size(); i++){
        jsonObj = jsonList.at(i).toObject();
        jsonArray = jsonObj["v"].toArray();
        model = new QStandardItemModel;

        for (int j = 0; j < jsonArray.size(); j++){
            QStandardItem* item = new QStandardItem;
            SystemPicture* super = new SystemPicture;
            super->read(jsonArray[j].toObject());
            item->setData(
                        QVariant::fromValue(reinterpret_cast<quintptr>(super)));
            item->setFlags(item->flags() ^ (Qt::ItemIsDropEnabled));
            item->setText(super->toString());
            model->appendRow(item);
        }

        m_models[static_cast<PictureKind>(jsonObj["k"].toInt())] = model;
    }
}

// -------------------------------------------------------

void PicturesDatas::write(QJsonObject &json) const{
    QJsonArray jsonFinalArray;
    QStandardItemModel* model;

    QHash<PictureKind, QStandardItemModel*>::const_iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++){
        model = i.value();
        QJsonObject jsonObj;
        QJsonArray jsonArray;
        jsonObj["k"] = (int) i.key();
        for (int j = 0; j < model->invisibleRootItem()->rowCount(); j++){
            QJsonObject jsonObjPicture;

            SystemPicture* super = ((SystemPicture*) model->item(j)->data()
                                    .value<quintptr>());
            super->write(jsonObjPicture);
            jsonArray.append(jsonObjPicture);
        }
        jsonObj["v"] = jsonArray;
        jsonFinalArray.append(jsonObj);
    }

    json["list"] = jsonFinalArray;
}

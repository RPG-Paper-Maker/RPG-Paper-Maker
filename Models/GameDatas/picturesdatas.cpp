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

void PicturesDatas::setModel(PictureKind kind, QStandardItemModel *model) {
    m_models[kind] = model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PicturesDatas::setDefault(){
    QList<QString> names;

    setDefaultBars(names);
    setDefaultIcons(names);
    setDefaultAutotiles(names);
    setDefaultCharacters(names);
    setDefaultReliefs(names);
    setDefaultTilesets(names);
    setDefaultWalls(names);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultBars(QList<QString>& names) {
    names << "hpBar" << "mpBar" << "spBar";
    setDefaultPictures(names, PictureKind::Bars);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultIcons(QList<QString>& names) {
    names << "darkness" << "fire" << "grass" << "light" << "water" << "wind";
    setDefaultPictures(names, PictureKind::Icons);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultAutotiles(QList<QString>& names) {
    names << "general";
    setDefaultPictures(names, PictureKind::Autotiles);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultCharacters(QList<QString>& names) {
    names << "lucas";
    setDefaultPictures(names, PictureKind::Characters);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultReliefs(QList<QString>& names) {
    names << "grass";
    setDefaultPictures(names, PictureKind::Reliefs);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultTilesets(QList<QString>& names) {
    names << "plains";
    setDefaultPictures(names, PictureKind::Tilesets);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultWalls(QList<QString>& names) {
    names << "inside1";
    setDefaultPictures(names, PictureKind::Walls);
}

// -------------------------------------------------------

void PicturesDatas::fillList(QList<SystemPicture*> &pictures,
                             QList<QString>& names)
{
    int i;

    pictures << new SystemPicture;
    for (i = 0; i < names.size() ; i++)
        pictures << new SystemPicture(i + 1, names.at(i) + ".png", true);
}

// -------------------------------------------------------

void PicturesDatas::setDefaultPictures(QList<QString> &names,
                                       PictureKind kind)
{
    QList<SystemPicture*> pictures;
    fillList(pictures, names);

    QStandardItemModel* model = new QStandardItemModel;
    QList<QStandardItem*> row;

    for (int i = 0; i < pictures.size(); i++){
        row = pictures.at(i)->getModelRow();
        model->appendRow(row);
    }
    m_models[kind] = model;

    names.clear();
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
    QList<QStandardItem*> row;

    // Clear
    QHash<PictureKind, QStandardItemModel*>::iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++)
        SuperListItem::deleteModel(i.value());

    // Read
    for (int i = 0; i < jsonList.size(); i++){
        jsonObj = jsonList.at(i).toObject();
        jsonArray = jsonObj["v"].toArray();
        model = new QStandardItemModel;

        for (int j = 0; j < jsonArray.size(); j++){
            SystemPicture* super = new SystemPicture;
            super->read(jsonArray[j].toObject());
            row = super->getModelRow();
            model->appendRow(row);
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

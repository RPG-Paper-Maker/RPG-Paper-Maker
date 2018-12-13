/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "songsdatas.h"
#include "wanok.h"
#include "common.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SongsDatas::SongsDatas()
{

}

SongsDatas::~SongsDatas()
{
    QHash<SongKind, QStandardItemModel*>::iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++)
        SuperListItem::deleteModel(i.value());
}

void SongsDatas::read(QString path){
    Wanok::readJSON(Common::pathCombine(path, Wanok::pathSongsDatas), *this);
}

QStandardItemModel* SongsDatas::model(SongKind kind) const {
    return m_models[kind];
}

void SongsDatas::setModel(SongKind kind, QStandardItemModel *model) {
    m_models[kind] = model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SongsDatas::setDefault(){
    QList<QString> names;

    setDefaultMusics(names);
    setDefaultBackgroundSounds(names);
    setDefaultSounds(names);
    setDefaultMusicEffects(names);
}

// -------------------------------------------------------

void SongsDatas::fillList(QList<SystemSong*> &songs, QList<QString>& names,
                          QString extension)
{
    int i;

    songs << new SystemSong;
    for (i = 0; i < names.size() ; i++)
        songs << new SystemSong(i + 1, names.at(i) + "." + extension, true);
}

// -------------------------------------------------------

void SongsDatas::setDefaultSongs(QList<QString> &names, SongKind kind,
                                 QString extension)
{
    QList<SystemSong*> songs;
    fillList(songs, names, extension);

    QStandardItemModel* model = new QStandardItemModel;
    QList<QStandardItem*> row;

    for (int i = 0; i < songs.size(); i++){
        row = songs.at(i)->getModelRow();
        model->appendRow(row);
    }
    m_models[kind] = model;

    names.clear();
}

// -------------------------------------------------------

void SongsDatas::setDefaultMusics(QList<QString>& names) {
    names << "Battle1" << "Field1";
    setDefaultSongs(names, SongKind::Music, "mp3");
}

// -------------------------------------------------------

void SongsDatas::setDefaultBackgroundSounds(QList<QString>& names) {
    setDefaultSongs(names, SongKind::BackgroundSound, "mp3");
}

// -------------------------------------------------------

void SongsDatas::setDefaultSounds(QList<QString>& names) {
    names << "Cancel" << "Confirmation" << "Cursor";
    setDefaultSongs(names, SongKind::Sound, "wav");
}

// -------------------------------------------------------

void SongsDatas::setDefaultMusicEffects(QList<QString>& names) {
    names << "Levelup";
    setDefaultSongs(names, SongKind::MusicEffect, "wav");
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SongsDatas::read(const QJsonObject &json){
    QJsonArray jsonList = json["list"].toArray();
    QJsonObject jsonObj;
    QJsonArray jsonArray;
    QStandardItemModel* model;
    QList<QStandardItem*> row;

    // Clear
    QHash<SongKind, QStandardItemModel*>::iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++)
        SuperListItem::deleteModel(i.value());

    // Read
    for (int i = 0; i < jsonList.size(); i++){
        jsonObj = jsonList.at(i).toObject();
        jsonArray = jsonObj["v"].toArray();
        model = new QStandardItemModel;

        for (int j = 0; j < jsonArray.size(); j++){
            SystemSong* super = new SystemSong;
            super->read(jsonArray[j].toObject());
            row = super->getModelRow();
            model->appendRow(row);
        }

        m_models[static_cast<SongKind>(jsonObj["k"].toInt())] = model;
    }
}

// -------------------------------------------------------

void SongsDatas::write(QJsonObject &json) const{
    QJsonArray jsonFinalArray;
    QStandardItemModel* model;

    QHash<SongKind, QStandardItemModel*>::const_iterator i;
    for (i = m_models.begin(); i != m_models.end(); i++){
        model = i.value();
        QJsonObject jsonObj;
        QJsonArray jsonArray;
        jsonObj["k"] = (int) i.key();
        for (int j = 0; j < model->invisibleRootItem()->rowCount(); j++){
            QJsonObject jsonObjSong;

            SystemSong* super = ((SystemSong*) model->item(j)->data()
                                    .value<quintptr>());
            super->write(jsonObjSong);
            jsonArray.append(jsonObjSong);
        }
        jsonObj["v"] = jsonArray;
        jsonFinalArray.append(jsonObj);
    }

    json["list"] = jsonFinalArray;
}

/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "songsdatas.h"
#include "rpm.h"
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
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_SONGS_DATAS), *this);
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
                          QString extension, SongKind kind)
{
    int i;

    songs << new SystemSong;
    songs.at(0)->setKind(kind);
    for (i = 0; i < names.size() ; i++)
    {
        songs << new SystemSong(i + 1, names.at(i) + "." + extension, true, "",
            kind);
    }
}

// -------------------------------------------------------

void SongsDatas::setDefaultSongs(QList<QString> &names, SongKind kind,
                                 QString extension)
{
    QList<SystemSong*> songs;
    fillList(songs, names, extension, kind);

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
    names << "Theme1" << "Battle1";
    setDefaultSongs(names, SongKind::Music, "mp3");
}

// -------------------------------------------------------

void SongsDatas::setDefaultBackgroundSounds(QList<QString>& names) {
    setDefaultSongs(names, SongKind::BackgroundSound, "mp3");
}

// -------------------------------------------------------

void SongsDatas::setDefaultSounds(QList<QString>& names) {
    names << "Cancel" << "Confirmation" << "Cursor" << "Levelup" << "Hit";
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
        SongKind k = static_cast<SongKind>(jsonObj["k"].toInt());

        for (int j = 0; j < jsonArray.size(); j++){
            SystemSong* super = new SystemSong;
            super->read(jsonArray[j].toObject());
            super->setKind(k);
            row = super->getModelRow();
            model->appendRow(row);
        }

        m_models[k] = model;
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

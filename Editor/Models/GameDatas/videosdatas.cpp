/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "videosdatas.h"
#include "rpm.h"
#include "common.h"

const QString VideosDatas::JSON_LIST = "list";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

VideosDatas::VideosDatas() :
    m_model(new QStandardItemModel)
{

}

VideosDatas::~VideosDatas() {
    SuperListItem::deleteModel(m_model);
}

void VideosDatas::read(QString path) {
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_VIDEOS_DATAS), *this);
}

QStandardItemModel * VideosDatas::model() const {
    return m_model;
}

void VideosDatas::setModel(QStandardItemModel *model) {
    m_model = model;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void VideosDatas::setDefault() {
    QList<QStandardItem *> row;
    SystemVideo *video;

    video = new SystemVideo;
    row = video->getModelRow();
    m_model->appendRow(row);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void VideosDatas::read(const QJsonObject &json) {
    QJsonArray tab = json[JSON_LIST].toArray();
    QList<QStandardItem *> row;
    SystemVideo *video;
    int i, l;

    // Clear
    SuperListItem::deleteModel(m_model, false);

    // Read
    tab = json[JSON_LIST].toArray();

    for (i = 0, l = tab.size(); i < l; i++) {
        video = new SystemVideo;
        video->read(tab[i].toObject());
        row = video->getModelRow();
        m_model->appendRow(row);
    }
}

// -------------------------------------------------------

void VideosDatas::write(QJsonObject &json) const {
    SystemVideo *video;
    QJsonArray tab;
    QJsonObject obj;
    int i, l;

    for (i = 0, l = m_model->invisibleRootItem()->rowCount(); i < l; i++) {
        video = reinterpret_cast<SystemVideo *>(m_model->item(i)->data().value<
            quintptr>());
        video->write(obj);
        tab.append(obj);
    }

    json[JSON_LIST] = tab;
}

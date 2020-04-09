/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef VIDEOSDATAS_H
#define VIDEOSDATAS_H

#include <QStandardItemModel>
#include "serializable.h"
#include "systemvideo.h"

// -------------------------------------------------------
//
//  CLASS VideosDatas
//
//  Contains all the possible videos of a game. The data file is located in
//  Content/Datas/videos.json.
//
// -------------------------------------------------------

class VideosDatas : public Serializable
{
public:
    const static QString JSON_LIST;

    VideosDatas();
    virtual ~VideosDatas();

    QStandardItemModel * model() const;
    void setModel(QStandardItemModel *model);

    void read(QString path);
    void setDefault();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

private:
    QStandardItemModel* m_model;
};

#endif // VIDEOSDATAS_H

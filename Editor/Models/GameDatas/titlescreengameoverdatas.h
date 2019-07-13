/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#ifndef TITLESCREENGAMEOVERDATAS_H
#define TITLESCREENGAMEOVERDATAS_H

#include "serializable.h"
#include "systemplaysong.h"

// -------------------------------------------------------
//
//  CLASS TitleScreenGameOverDatas
//
//  Contains all title screen and game over datas. The data file is located in
//  Content/Datas/titlescreenGameover.json.
//
// -------------------------------------------------------

class TitleScreenGameOverDatas : public Serializable
{
public:
    static const QString JSON_TITLE_LOGO;
    static const QString JSON_TITLE_BACKGROUND;
    static const QString JSON_TITLE_MUSIC;

    TitleScreenGameOverDatas();
    virtual ~TitleScreenGameOverDatas();
    SuperListItem * titleLogoID() const;
    SuperListItem * titleBackgroundID() const;
    SystemPlaySong * titleMusic() const;

    void read(QString path);
    void setDefault();

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    SuperListItem *m_titleLogoID;
    SuperListItem *m_titleBackgroundID;
    SystemPlaySong *m_titleMusic;
};

#endif // TITLESCREENGAMEOVERDATAS_H

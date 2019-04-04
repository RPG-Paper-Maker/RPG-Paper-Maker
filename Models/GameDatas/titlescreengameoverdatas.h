/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
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

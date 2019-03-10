/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

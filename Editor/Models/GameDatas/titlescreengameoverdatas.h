/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
#include "titlesettingkind.h"

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
    static const QString JSON_IS_TITLE_BACKGROUND_IMAGE;
    static const QString JSON_TITLE_BACKGROUND_IMAGE;
    static const QString JSON_TITLE_BACKGROUND_VIDEO;
    static const QString JSON_TITLE_MUSIC;
    static const QString JSON_TITLE_COMMANDS;
    static const QString JSON_TITLE_SETTINGS;

    TitleScreenGameOverDatas();
    virtual ~TitleScreenGameOverDatas();

    bool isBackgroundImage() const;
    void setIsBackgroundImage(bool b);
    SuperListItem * titleBackgroundImageID() const;
    SuperListItem * titleBackgroundVideoID() const;
    SystemPlaySong * titleMusic() const;
    QStandardItemModel * modelTitleCommands() const;
    QStandardItemModel * modelTitleSettings() const;

    void read(QString path);
    void setDefault();
    void setDefaultTitle();
    void setDefaultTitleCommands();
    void setDefaultTitleSettings();
    void addTitleSetting(TitleSettingKind kind);

    virtual void read(const QJsonObject &json);
    virtual void write(QJsonObject &json) const;

protected:
    bool m_isBackgroundImage;
    SuperListItem *m_titleBackgroundImageID;
    SuperListItem *m_titleBackgroundVideoID;
    SystemPlaySong *m_titleMusic;
    QStandardItemModel *m_modelTitleCommands;
    QStandardItemModel *m_modelTitleSettings;
};

#endif // TITLESCREENGAMEOVERDATAS_H
